import fs from 'node:fs';
import path from 'node:path';

export interface KnowledgeChunk {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
}

export function parseKnowledgeDocuments(documents: Array<{ filePath: string; content: string }>): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const document of documents) {
    if (!document.filePath.endsWith('.md')) continue;
    // Split by Markdown headers (## or #)
    const sections = document.content.split(/\n(?=##?\s)/);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;

      const lines = section.split('\n');
      const title = lines[0].replace(/^##?\s*/, '').trim();

      const words = section.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      const keywords = Array.from(new Set(words.filter(w => w.length > 2)));

      chunks.push({
        id: `${document.filePath}-${i}`,
        source: document.filePath,
        title,
        content: section,
        keywords,
      });
    }
  }

  return chunks;
}

async function loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
  if (!process.env.DATABASE_URL) {
    const knowledgeDir = path.resolve(process.cwd(), 'server/knowledge');
    if (!fs.existsSync(knowledgeDir)) return [];
    const documents = fs.readdirSync(knowledgeDir)
      .filter(filePath => filePath.endsWith('.md'))
      .map(filePath => ({
        filePath,
        content: fs.readFileSync(path.join(knowledgeDir, filePath), 'utf-8'),
      }));
    return parseKnowledgeDocuments(documents);
  }

  const { db } = await import('../db/store');
  const documents = await db.kbDocuments.list();
  return parseKnowledgeDocuments(documents.filter(document => document.status === 'APPROVED'));
}

export async function retrieveRelevantKnowledge(query: string, topK = 4): Promise<{ text: string; sources: string[] }> {
  const chunks = await loadKnowledgeBase();
  if (chunks.length === 0) {
    return { text: '', sources: [] };
  }

  const queryWords = (query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(w => w.length > 1);

  const scored = chunks.map(chunk => {
    let score = 0;
    const lowerContent = chunk.content.toLowerCase();
    const lowerTitle = chunk.title.toLowerCase();

    for (const word of queryWords) {
      if (lowerTitle.includes(word)) {
        score += 8;
      }
      if (lowerContent.includes(word)) {
        score += 2;
      }
      if (chunk.keywords.includes(word)) {
        score += 1;
      }
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.filter(item => item.score > 0).slice(0, topK);
  if (top.length === 0) {
    // Fallback to general overview chunks
    const fallback = chunks.slice(0, 2);
    return {
      text: fallback.map(c => `[Nguồn: ${c.source} | ${c.title}]\n${c.content}`).join('\n\n'),
      sources: fallback.map(c => c.source),
    };
  }

  const text = top.map(item => `[Nguồn: ${item.chunk.source} | ${item.chunk.title}]\n${item.chunk.content}`).join('\n\n');
  const sources = Array.from(new Set(top.map(item => item.chunk.source)));

  return { text, sources };
}

export async function findApprovedFaqAnswer(query: string): Promise<{ answer: string; source: string } | null> {
  return matchApprovedFaqAnswer(query, await loadKnowledgeBase());
}

export function matchApprovedFaqAnswer(
  query: string,
  chunks: KnowledgeChunk[],
): { answer: string; source: string } | null {
  const stopWords = new Set([
    'anh', 'chi', 'chị', 'cho', 'em', 'cua', 'của', 'giup', 'giúp', 'toi', 'tôi',
    'minh', 'mình', 'muon', 'muốn', 'hoi', 'hỏi', 'la', 'là', 'bao', 'nhiêu',
    'the', 'thế', 'nao', 'nào', 'voi', 'với', 'duoc', 'được', 'khong', 'không',
    've', 'về', 'co', 'có', 'xin', 'mot', 'một',
  ]);
  const terms = (text: string) => (text.toLocaleLowerCase('vi').match(/[\p{L}\p{N}]+/gu) || [])
    .filter(term => term.length > 1 && !stopWords.has(term));
  const queryTerms = new Set(terms(query));
  if (queryTerms.size === 0) return null;

  const candidates = chunks
    .filter(chunk => /^(?:câu hỏi|q)\s*:/i.test(chunk.title))
    .map(chunk => {
      const titleTerms = new Set(terms(chunk.title));
      const matches = [...queryTerms].filter(term => titleTerms.has(term)).length;
      const answer = chunk.content.match(/\*\*trả lời:\*\*\s*([\s\S]*)/i)?.[1]?.trim();
      return { chunk, matches, answer };
    })
    .filter(candidate => candidate.answer && candidate.matches >= Math.min(2, queryTerms.size))
    .sort((a, b) => b.matches - a.matches);

  const best = candidates[0];
  if (!best?.answer) return null;
  return { answer: best.answer, source: best.chunk.source };
}
