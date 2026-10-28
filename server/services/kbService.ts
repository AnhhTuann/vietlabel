import crypto from 'crypto';
import { db } from '../db/store.js';
import { KbDocument } from '../db/schema.js';
import { parseKnowledgeDocuments } from '../lib/rag.js';

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

    if (status === 'APPROVED') await this.reingest();

    return doc;
  },

  async updateDocument(id: string, updates: Partial<KbDocument>): Promise<KbDocument> {
    const existing = await db.kbDocuments.findById(id);
    if (!existing) throw new Error('Không tìm thấy tài liệu.');
    const updated = await db.kbDocuments.update(id, updates);
    if (!updated) throw new Error('Không tìm thấy tài liệu.');

    if (updated.status === 'APPROVED' || existing.status === 'APPROVED') await this.reingest();

    return updated;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const doc = await db.kbDocuments.findById(id);
    if (!doc) return false;
    const deleted = await db.kbDocuments.delete(id);
    if (deleted && doc.status === 'APPROVED') await this.reingest();
    return deleted;
  },

  async reingest(): Promise<{ chunksCount: number; timestamp: string }> {
    const allDocs = await db.kbDocuments.list();
    const approvedDocs = allDocs.filter(d => d.status === 'APPROVED');
    for (const doc of approvedDocs) {
      await db.kbDocuments.update(doc.id, { ingestedAt: new Date().toISOString() });
    }

    const chunks = parseKnowledgeDocuments(approvedDocs);
    console.log(`[KB REINGEST] Successfully ingested ${chunks.length} chunks from ${approvedDocs.length} approved documents.`);

    return {
      chunksCount: chunks.length,
      timestamp: new Date().toISOString(),
    };
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
