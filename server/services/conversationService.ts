import { db } from '../db/store';
import { Conversation, Message, MessageSender } from '../db/schema';
import { realtimeHub } from './realtimeService';

export interface AppendMessageInput {
  conversationId: string;
  sender: MessageSender;
  staffId?: string;
  staffName?: string;
  text: string;
  attachments?: Array<{ name: string; url?: string; size?: number }>;
}

export const conversationService = {
  appendMessage(input: AppendMessageInput): Message {
    const conv = db.conversations.findById(input.conversationId);
    if (!conv) {
      throw new Error('Không tìm thấy cuộc trò chuyện.');
    }

    const now = new Date().toISOString();
    const msg = db.messages.create({
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId: input.conversationId,
      sender: input.sender,
      staffId: input.staffId,
      staffName: input.staffName,
      text: input.text,
      attachments: input.attachments,
      createdAt: now,
    });

    db.conversations.update(conv.id, {
      lastMessageAt: now,
    });

    // Broadcast message to realtime listeners
    realtimeHub.broadcast('message:new', {
      conversationId: conv.id,
      leadId: conv.leadId,
      message: msg,
    });

    return msg;
  },

  takeover(conversationId: string, staffId: string, staffName: string): Conversation {
    const conv = db.conversations.findById(conversationId);
    if (!conv) throw new Error('Không tìm thấy cuộc hội thoại.');

    const updated = db.conversations.update(conv.id, {
      mode: 'HUMAN',
      humanAgentId: staffId,
    });

    if (!updated) throw new Error('Chuyển quyền tiếp quản thất bại.');

    // Append system message
    this.appendMessage({
      conversationId,
      sender: 'SYSTEM',
      text: `Chuyên viên tư vấn ${staffName} đã tiếp quản cuộc trò chuyện.`,
    });

    // Log lead event
    db.events.create({
      id: `ev_${Date.now()}_takeover`,
      leadId: conv.leadId,
      type: 'TAKEOVER',
      actorId: staffId,
      actorName: staffName,
      createdAt: new Date().toISOString(),
    });

    realtimeHub.broadcast('conversation:modeChanged', {
      conversationId,
      leadId: conv.leadId,
      mode: 'HUMAN',
      staffName,
    });

    return updated;
  },

  release(conversationId: string, staffId: string, staffName: string): Conversation {
    const conv = db.conversations.findById(conversationId);
    if (!conv) throw new Error('Không tìm thấy cuộc hội thoại.');

    const updated = db.conversations.update(conv.id, {
      mode: 'BOT',
      humanAgentId: undefined,
    });

    if (!updated) throw new Error('Trả lại cho bot thất bại.');

    // Append system & bot message
    this.appendMessage({
      conversationId,
      sender: 'SYSTEM',
      text: `Đã hoàn trả hội thoại cho Trợ lý AI.`,
    });

    this.appendMessage({
      conversationId,
      sender: 'BOT',
      text: `Chào anh/chị, em là Trợ lý AI Vietlabel! Em đã quay trở lại để tiếp tục hỗ trợ tư vấn quy cách và vật liệu bao bì. Anh/chị cần hỏi thêm thông tin gì cứ nhắn em nhé!`,
    });

    db.events.create({
      id: `ev_${Date.now()}_release`,
      leadId: conv.leadId,
      type: 'RELEASED',
      actorId: staffId,
      actorName: staffName,
      createdAt: new Date().toISOString(),
    });

    realtimeHub.broadcast('conversation:modeChanged', {
      conversationId,
      leadId: conv.leadId,
      mode: 'BOT',
    });

    return updated;
  },

  getConversation(conversationId: string) {
    const conv = db.conversations.findById(conversationId);
    if (!conv) return null;
    const messages = db.messages.listByConversationId(conv.id);
    return { ...conv, messages };
  },

  listActiveInbox() {
    const convs = db.conversations.list();
    return convs.map(c => {
      const lead = db.leads.findById(c.leadId);
      const messages = db.messages.listByConversationId(c.id);
      const lastMessage = messages[messages.length - 1];
      const unreadCount = messages.filter(m => m.sender === 'CUSTOMER' && !m.readAt).length;

      return {
        ...c,
        lead,
        lastMessage,
        unreadCount,
        totalMessages: messages.length,
      };
    }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },
};
