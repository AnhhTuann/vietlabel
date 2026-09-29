import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  UserCheck,
  RotateCcw,
  Paperclip,
  Phone,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Building,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';
import { Button } from '../../components/ui/Button';

export const AdminInboxPage: React.FC = () => {
  const { user, token } = useAdminAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [activeConvData, setActiveConvData] = useState<any>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'MINE' | 'HUMAN'>('ALL');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Realtime updates
  useAdminRealtime((eventName, data) => {
    if (eventName === 'message:new' || eventName === 'conversation:modeChanged') {
      fetchInboxList();
      if (selectedConvId && data.conversationId === selectedConvId) {
        fetchConversationDetail(selectedConvId);
      }
    }
  });

  const fetchInboxList = async () => {
    try {
      const res = await fetch('/api/admin/inbox', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!selectedConvId && data.conversations?.length > 0) {
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Fetch inbox error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversationDetail = async (convId: string) => {
    try {
      const res = await fetch(`/api/admin/leads?status=ALL`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Or find conversation directly
      const conv = conversations.find(c => c.id === convId);
      if (conv) {
        // Fetch detailed lead to get messages
        const leadRes = await fetch(`/api/admin/leads/${conv.leadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (leadRes.ok) {
          const detail = await leadRes.json();
          setActiveConvData(detail);
        }
      }
    } catch (err) {
      console.error('Fetch conversation detail failed:', err);
    }
  };

  useEffect(() => {
    fetchInboxList();
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchConversationDetail(selectedConvId);
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvData]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/conversations/${selectedConvId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      if (res.ok) {
        setInputText('');
        fetchConversationDetail(selectedConvId);
        fetchInboxList();
      }
    } catch (err) {
      console.error('Send message failed:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleTakeover = async () => {
    if (!selectedConvId) return;
    try {
      await fetch(`/api/admin/conversations/${selectedConvId}/takeover`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchConversationDetail(selectedConvId);
      fetchInboxList();
    } catch (err) {
      console.error('Takeover failed:', err);
    }
  };

  const handleRelease = async () => {
    if (!selectedConvId) return;
    try {
      await fetch(`/api/admin/conversations/${selectedConvId}/release`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchConversationDetail(selectedConvId);
      fetchInboxList();
    } catch (err) {
      console.error('Release failed:', err);
    }
  };

  const quickTemplates = [
    'Dạ Vietlabel chào anh/chị! Em là nhân viên phụ trách đơn hàng của mình.',
    'Dạ anh/chị cho em xin file thiết kế (AI/PDF) để xưởng kiểm tra độ phân giải và bù lé in ấn nhé ạ.',
    'Dạ chuyên viên kỹ thuật dự toán đang lên bảng tính giá chi tiết, sẽ gửi lại anh/chị trong 10 phút ạ!',
  ];

  const filteredConversations = conversations.filter(c => {
    if (filterType === 'MINE') return c.humanAgentId === user?.id || c.lead?.assignedToId === user?.id;
    if (filterType === 'HUMAN') return c.mode === 'HUMAN';
    return true;
  });

  const activeConv = conversations.find(c => c.id === selectedConvId);
  const isHumanMode = activeConv?.mode === 'HUMAN';

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* 1. Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-[#0B2A4A] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#E8531D]" />
              Hộp Thư Trực Tiếp
            </h2>
            <span className="text-xs bg-slate-200 font-bold px-2 py-0.5 rounded-full text-slate-700">
              {filteredConversations.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 text-[11px] font-bold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                filterType === 'ALL' ? 'bg-[#0B2A4A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('MINE')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                filterType === 'MINE' ? 'bg-[#0B2A4A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Của tôi
            </button>
            <button
              onClick={() => setFilterType('HUMAN')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                filterType === 'HUMAN' ? 'bg-[#E8531D] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang tiếp quản
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Đang tải hội thoại...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">Không có cuộc trò chuyện nào.</div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = c.id === selectedConvId;
              const isHuman = c.mode === 'HUMAN';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`p-3.5 hover:bg-slate-100 cursor-pointer transition-colors relative ${
                    isSelected ? 'bg-orange-50/50 border-l-4 border-[#E8531D]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {c.lead?.customerName || 'Khách hàng web'}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(c.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 truncate">
                    {c.lead?.company && <span className="text-slate-700 font-medium truncate max-w-[120px]">{c.lead.company}</span>}
                    <span>• {c.lead?.productType}</span>
                  </div>

                  <p className="text-xs text-slate-600 truncate mt-1">
                    {c.lastMessage?.text || 'Bắt đầu hội thoại'}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHuman ? 'bg-orange-100 text-[#E8531D]' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isHuman ? '👤 NHÂN VIÊN TIẾP QUẢN' : '🤖 TRỢ LÝ BOT AI'}
                    </span>

                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#E8531D] text-white text-[10px] font-bold flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right Workspace: Live Chat & Controls */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/30">
        {selectedConvId && activeConvData ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0B2A4A] text-white flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#0B2A4A]">
                      {activeConvData.lead?.customerName || 'Khách hàng web'}
                    </h3>
                    <span className="font-mono text-xs bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-600">
                      {activeConvData.lead?.code}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    {activeConvData.lead?.phone && <span>📞 {activeConvData.lead.phone}</span>}
                    {activeConvData.lead?.email && <span>✉️ {activeConvData.lead.email}</span>}
                  </span>
                </div>
              </div>

              {/* Takeover Mode Action Button */}
              <div className="flex items-center gap-2">
                {isHumanMode ? (
                  <Button
                    onClick={handleRelease}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold border-orange-300 text-[#E8531D] hover:bg-orange-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    <span>Trả lại cho AI</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleTakeover}
                    variant="primary"
                    size="sm"
                    className="bg-[#E8531D] hover:bg-[#D04210] text-xs font-bold shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                    <span>Tiếp quản cuộc trò chuyện</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F8FAFC]">
              {(activeConvData.messages || []).map((msg: any) => {
                const isCustomer = msg.sender === 'CUSTOMER';
                const isStaff = msg.sender === 'STAFF';
                const isSystem = msg.sender === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="text-[11px] text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full font-medium inline-block">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                      {isCustomer ? (
                        <span>Khách hàng</span>
                      ) : isStaff ? (
                        <span className="font-bold text-[#E8531D]">Nhân viên: {msg.staffName || user?.name}</span>
                      ) : (
                        <span className="font-semibold text-blue-600">Trợ lý AI Vietlabel</span>
                      )}
                      <span>• {new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap shadow-xs ${
                        isCustomer
                          ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                          : isStaff
                          ? 'bg-[#E8531D] text-white rounded-tr-xs'
                          : 'bg-[#0B2A4A] text-white rounded-tr-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick response template chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
              {quickTemplates.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(tmpl)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {tmpl.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isHumanMode
                    ? `Nhập tin nhắn với tư cách ${user?.name}...`
                    : 'Gõ tin nhắn để gửi cho khách (hệ thống sẽ tự động chuyển sang chế độ tiếp quản)...'
                }
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
              />

              <Button
                type="submit"
                disabled={!inputText.trim() || isSending}
                variant="primary"
                size="md"
                className="bg-[#E8531D] hover:bg-[#D04210] font-bold text-xs"
              >
                <Send className="w-4 h-4 mr-1" />
                <span>Gửi</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Chọn một cuộc hội thoại bên trái để bắt đầu trả lời khách hàng.
          </div>
        )}
      </div>
    </div>
  );
};
