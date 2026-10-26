import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from '../db/store';
import { KbDocument } from '../db/schema';
import { clearKnowledgeBaseCache, loadKnowledgeBase } from '../lib/rag';

const KNOWLEDGE_DIR = path.resolve(process.cwd(), 'server/knowledge');

function resolveKnowledgePath(filePath: string): string {
  const resolved = path.resolve(KNOWLEDGE_DIR, filePath);
  if (path.dirname(resolved) !== KNOWLEDGE_DIR || !filePath.endsWith('.md')) {
    throw new Error('Đường dẫn tài liệu kiến thức không hợp lệ.');
  }
  return resolved;
}

async function removeDocumentFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(resolveKnowledgePath(filePath));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

export const kbService = {
  async listDocuments(): Promise<KbDocument[]> {
    return db.kbDocuments.list();
  },

  async getDocument(id: string): Promise<KbDocument | null> {
    return db.kbDocuments.findById(id);
  },

  async createDocument(title: string, content: string, status: 'DRAFT' | 'APPROVED' = 'DRAFT'): Promise<KbDocument> {
    const id = crypto.randomUUID();
    const doc = await db.kbDocuments.create({
      id: `kb_${id}`,
      title,
      filePath: `${id}.md`,
      content,
      status,
      updatedAt: new Date().toISOString(),
    });

    if (status === 'APPROVED') {
      await this.writeDocumentToDisk(doc);
      await this.reingest();
    }

    return doc;
  },

  async updateDocument(id: string, updates: Partial<KbDocument>): Promise<KbDocument> {
    const existing = await db.kbDocuments.findById(id);
    if (!existing) throw new Error('Không tìm thấy tài liệu.');
    const updated = await db.kbDocuments.update(id, updates);
    if (!updated) throw new Error('Không tìm thấy tài liệu.');

    if (updated.status === 'APPROVED') {
      await this.writeDocumentToDisk(updated);
      await this.reingest();
    } else {
      await removeDocumentFile(existing.filePath);
      await this.refreshKnowledgeBase();
    }

    return updated;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const doc = await db.kbDocuments.findById(id);
    if (!doc) return false;
    await removeDocumentFile(doc.filePath);
    const deleted = await db.kbDocuments.delete(id);
    if (deleted) {
      await this.refreshKnowledgeBase();
    }
    return deleted;
  },

  async writeDocumentToDisk(doc: KbDocument): Promise<void> {
    await fs.promises.mkdir(KNOWLEDGE_DIR, { recursive: true });
    await fs.promises.writeFile(resolveKnowledgePath(doc.filePath), doc.content, 'utf-8');
  },

  async reingest(): Promise<{ chunksCount: number; timestamp: string }> {
    const allDocs = await db.kbDocuments.list();
    const approvedDocs = allDocs.filter(d => d.status === 'APPROVED');
    for (const doc of approvedDocs) {
      await this.writeDocumentToDisk(doc);
      await db.kbDocuments.update(doc.id, { ingestedAt: new Date().toISOString() });
    }

    for (const doc of allDocs) {
      if (doc.status !== 'APPROVED') await removeDocumentFile(doc.filePath);
    }

    await this.refreshKnowledgeBase();
    const chunks = loadKnowledgeBase();
    console.log(`[KB REINGEST] Successfully ingested ${chunks.length} chunks from ${approvedDocs.length} approved documents.`);

    return {
      chunksCount: chunks.length,
      timestamp: new Date().toISOString(),
    };
  },

  async refreshKnowledgeBase(): Promise<void> {
    clearKnowledgeBaseCache();
    loadKnowledgeBase();
  },

  async flagWrongAnswer(messageId: string, feedbackReason?: string): Promise<void> {
    const msg = await db.messages.update(messageId, { isFlaggedWrong: true });
    if (msg) {
      console.warn(`[KB AUDIT] Message ${messageId} was flagged as incorrect answer: ${feedbackReason || 'No comment'}`);
    }
  },

  async listFlaggedAnswers() {
    const allConvs = await db.conversations.list();
    const flagged = [];
    for (const c of allConvs) {
      const messages = await db.messages.listByConversationId(c.id);
      for (const m of messages) {
        if (m.isFlaggedWrong) {
          const lead = await db.leads.findById(c.leadId);
          const flaggedIndex = messages.findIndex(message => message.id === m.id);
          const customerQuestion = messages
            .slice(0, flaggedIndex)
            .reverse()
            .find(message => message.sender === 'CUSTOMER');
          flagged.push({
            message: m,
            customerQuestion,
            conversation: c,
            lead,
          });
        }
      }
    }
    return flagged;
  },
};
