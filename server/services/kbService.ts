import fs from 'fs';
import path from 'path';
import { db } from '../db/store';
import { KbDocument } from '../db/schema';
import { loadKnowledgeBase } from '../lib/rag';

export const kbService = {
  listDocuments(): KbDocument[] {
    return db.kbDocuments.list();
  },

  getDocument(id: string): KbDocument | null {
    return db.kbDocuments.findById(id) || null;
  },

  createDocument(title: string, content: string, status: 'DRAFT' | 'APPROVED' = 'DRAFT'): KbDocument {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;
    const doc = db.kbDocuments.create({
      id: `kb_${Date.now()}`,
      title,
      filePath: filename,
      content,
      status,
      updatedAt: new Date().toISOString(),
    });

    if (status === 'APPROVED') {
      this.writeDocumentToDisk(doc);
    }

    return doc;
  },

  updateDocument(id: string, updates: Partial<KbDocument>): KbDocument {
    const updated = db.kbDocuments.update(id, updates);
    if (!updated) throw new Error('Không tìm thấy tài liệu.');

    if (updated.status === 'APPROVED') {
      this.writeDocumentToDisk(updated);
    }

    return updated;
  },

  deleteDocument(id: string): boolean {
    const doc = db.kbDocuments.findById(id);
    if (doc) {
      const diskPath = path.resolve(process.cwd(), 'server/knowledge', doc.filePath);
      if (fs.existsSync(diskPath)) {
        try { fs.unlinkSync(diskPath); } catch (e) {}
      }
    }
    return db.kbDocuments.delete(id);
  },

  writeDocumentToDisk(doc: KbDocument) {
    const knowledgeDir = path.resolve(process.cwd(), 'server/knowledge');
    if (!fs.existsSync(knowledgeDir)) {
      fs.mkdirSync(knowledgeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(knowledgeDir, doc.filePath), doc.content, 'utf-8');
  },

  reingest(): { chunksCount: number; timestamp: string } {
    // Write all approved documents to disk
    const approvedDocs = db.kbDocuments.list().filter(d => d.status === 'APPROVED');
    for (const doc of approvedDocs) {
      this.writeDocumentToDisk(doc);
      db.kbDocuments.update(doc.id, { ingestedAt: new Date().toISOString() });
    }

    // Trigger reload of RAG chunks
    const chunks = loadKnowledgeBase();
    console.log(`[KB REINGEST] Successfully ingested ${chunks.length} chunks from ${approvedDocs.length} approved documents.`);

    return {
      chunksCount: chunks.length,
      timestamp: new Date().toISOString(),
    };
  },

  flagWrongAnswer(messageId: string, feedbackReason?: string): void {
    const msg = db.messages.update(messageId, { isFlaggedWrong: true });
    if (msg) {
      console.warn(`[KB AUDIT] Message ${messageId} was flagged as incorrect answer: ${feedbackReason || 'No comment'}`);
    }
  },

  listFlaggedAnswers() {
    const allConvs = db.conversations.list();
    const flagged = [];
    for (const c of allConvs) {
      const messages = db.messages.listByConversationId(c.id);
      for (const m of messages) {
        if (m.isFlaggedWrong) {
          const lead = db.leads.findById(c.leadId);
          flagged.push({
            message: m,
            conversation: c,
            lead,
          });
        }
      }
    }
    return flagged;
  },
};
