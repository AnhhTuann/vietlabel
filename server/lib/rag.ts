import fs from 'fs';
import path from 'path';

export interface KnowledgeChunk {
  id: string;
  source: string;
  title: string;
  content: string;
  keywords: string[];
}

let cachedChunks: KnowledgeChunk[] | null = null;

export function loadKnowledgeBase(): KnowledgeChunk[] {
  if (cachedChunks) return cachedChunks;

  const knowledgeDir = path.resolve(process.cwd(), 'server/knowledge');
  const chunks: KnowledgeChunk[] = [];

  if (!fs.existsSync(knowledgeDir)) {
    return [];
  }

  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(knowledgeDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Split by Markdown headers (## or #)
    const sections = content.split(/\n(?=##?\s)/);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      if (!section) continue;

      const lines = section.split('\n');
      const title = lines[0].replace(/^##?\s*/, '').trim();
      const body = lines.slice(1).join('\n').trim();

      const words = section.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
      const keywords = Array.from(new Set(words.filter(w => w.length > 2)));

      chunks.push({
        id: `${file}-${i}`,
        source: file,
        title,
        content: section,
        keywords,
      });
    }
  }

  cachedChunks = chunks;
  return chunks;
}

export function retrieveRelevantKnowledge(query: string, topK = 4): { text: string; sources: string[] } {
  const chunks = loadKnowledgeBase();
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
