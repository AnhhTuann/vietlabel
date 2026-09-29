import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi, ChatMessageItem } from '../services/chatApi';
import { CustomerBrief, evaluateLeadScore, LeadScoreLevel } from '../config/leadScoring';

const SESSION_STORAGE_KEY = 'vietlabel_chat_history_v1';
const SESSION_ID_KEY = 'vietlabel_chat_session_id';

const INITIAL_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'msg-welcome',
  role: 'assistant',
  content: `Chào anh/chị! Em là **Trợ lý AI Vietlabel** 🤖.

Em có thể hỗ trợ anh/chị tư vấn nhanh về:
• **Tem nhãn Decal cuộn**: Dầu nhớt, dược phẩm, mỹ phẩm, tem pop-up gập mở, tem vỡ chống giả...
• **Bao bì hộp giấy cao cấp**: Hộp cứng nắp nam châm, hộp mềm folding carton.
• **Túi giấy Kraft & Thùng carton**: Tiêu chuẩn xuất khẩu, chứng chỉ FSC, ISO 9001.

Anh/chị có thể chọn nhanh gợi ý bên dưới hoặc nhắn trực tiếp nhu cầu cho em nhé!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `vl-sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

export function useChat() {
  const [sessionId] = useState<string>(getOrCreateSessionId);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [extractedBrief, setExtractedBrief] = useState<CustomerBrief>({});
  const [leadScore, setLeadScore] = useState<LeadScoreLevel>('WARM');
  const [needHuman, setNeedHuman] = useState<boolean>(false);
  const [briefReady, setBriefReady] = useState<boolean>(false);
  const [isBriefSubmitted, setIsBriefSubmitted] = useState<boolean>(false);
  const [briefLeadId, setBriefLeadId] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      // ignore
    }
  }, [messages]);

  // Recalculate lead scoring whenever brief changes
  useEffect(() => {
    const evaluated = evaluateLeadScore(extractedBrief);
    setLeadScore(evaluated.level);
    if (evaluated.isEscalateRecommended) {
      setNeedHuman(true);
    }
  }, [extractedBrief]);

  const sendMessage = useCallback(async (content: string, attachments?: Array<{ name: string; url?: string; size?: number }>) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    setError(null);

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const apiPayload = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatApi.sendMessage({
        sessionId,
        messages: apiPayload,
        attachments,
        signal: abortControllerRef.current.signal,
        onChunk: (chunk) => {
          setStreamingText(prev => prev + chunk);
        },
      });

      const assistantMessage: ChatMessageItem = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update extracted fields and status
      if (res.extractedFields && Object.keys(res.extractedFields).length > 0) {
        setExtractedBrief(prev => ({
          ...prev,
          ...res.extractedFields,
        }));
      }

      if (res.needHuman) setNeedHuman(true);
      if (res.briefReady) setBriefReady(true);
      if (res.leadScore) setLeadScore(res.leadScore);

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.error('Chat error:', err);
      setError(err.message || 'Lỗi kết nối máy chủ');

      const errorMessage: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Dạ xin lỗi anh/chị, kết nối tạm thời bị gián đoạn. Anh/chị có thể nhấn nút "Thử lại" bên dưới hoặc liên hệ trực tiếp Hotline 086 896 8089 để được phục vụ ngay ạ.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingText('');
      abortControllerRef.current = null;
    }
  }, [messages, sessionId]);

  const retryLastMessage = useCallback(() => {
    // Find the last user message
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      // Remove any trailing error message
      setMessages(prev => prev.filter(m => !m.isError));
      sendMessage(lastUser.content, lastUser.attachments);
    }
  }, [messages, sendMessage]);

  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const newId = `vl-sess-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    sessionStorage.setItem(SESSION_ID_KEY, newId);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setExtractedBrief({});
    setNeedHuman(false);
    setBriefReady(false);
    setIsBriefSubmitted(false);
    setBriefLeadId(null);
    setError(null);
  }, []);

  const updateBrief = useCallback((fields: Partial<CustomerBrief>) => {
    setExtractedBrief(prev => ({ ...prev, ...fields }));
  }, []);

  const submitBrief = useCallback(async (overrides?: Partial<CustomerBrief>) => {
    const finalBrief: CustomerBrief = {
      ...extractedBrief,
      ...overrides,
      leadScore,
    };

    setIsLoading(true);
    try {
      const res = await chatApi.submitCustomerBrief({
        ...finalBrief,
        sessionId,
      });

      setIsBriefSubmitted(true);
      setBriefLeadId(res.leadId || null);

      // Add assistant confirmation message in chat
      const confirmMessage: ChatMessageItem = {
        id: `confirm-${Date.now()}`,
        role: 'assistant',
        content: `🎉 **Đã gửi yêu cầu thành công!** (Mã yêu cầu: \`${res.leadId || 'VL-LEAD'}\`)\n\nChuyên viên dự toán kỹ thuật Vietlabel đã tiếp nhận đầy đủ thông số và sẽ liên hệ phản hồi qua **${finalBrief.contact || 'SĐT/Zalo'}** trong vòng **2 giờ làm việc**.\n\nNếu cần hàng gấp, anh/chị vui lòng gọi trực tiếp hotline **086 896 8089** để được duyệt lệnh in ngay nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, confirmMessage]);
      return res;
    } catch (err: any) {
      setError(err.message || 'Không thể gửi yêu cầu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [extractedBrief, leadScore, sessionId]);

  const triggerHandoff = useCallback(async (customContact?: string) => {
    const contactToUse = customContact || extractedBrief.contact;
    setIsLoading(true);

    try {
      const res = await chatApi.requestHumanHandoff({
        contact: contactToUse,
        fullName: extractedBrief.fullName,
        productType: extractedBrief.productType,
        sessionId,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
      });

      setNeedHuman(true);

      const noticeMessage: ChatMessageItem = {
        id: `handoff-${Date.now()}`,
        role: 'assistant',
        content: `🚨 **Đã chuyển tiếp yêu cầu tới chuyên viên phụ trách!** (Mã: \`${res.leadId}\`)\n\n${res.message}\n\nAnh/chị có thể bấm gọi ngay Hotline **086 896 8089** hoặc nhắn tin Zalo OA bên dưới để được hỗ trợ tức thì.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, noticeMessage]);
      return res;
    } catch (err: any) {
      console.error('Handoff error:', err);
      setNeedHuman(true);
    } finally {
      setIsLoading(false);
    }
  }, [extractedBrief, messages, sessionId]);

  return {
    sessionId,
    messages,
    isLoading,
    isStreaming,
    streamingText,
    error,
    extractedBrief,
    leadScore,
    needHuman,
    briefReady,
    isBriefSubmitted,
    briefLeadId,
    sendMessage,
    retryLastMessage,
    resetChat,
    updateBrief,
    submitBrief,
    setNeedHuman,
    triggerHandoff,
  };
}
