import { GoogleGenAI } from '@google/genai';
import { ADVISOR_SYSTEM_PROMPT } from '../prompts/advisor.js';
import { findApprovedFaqAnswer, retrieveRelevantKnowledge } from './rag.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AdvisorAnalysisResult {
  replyText: string;
  extractedFields: Record<string, any>;
  missingFields: string[];
  leadScore: 'HOT' | 'WARM' | 'COLD';
  needHuman: boolean;
  briefReady: boolean;
  sources: string[];
  messageId?: string;
}

function getGeminiClient(): GoogleGenAI | null {
  const provider = process.env.AI_PROVIDER || 'rules';
  if (provider === 'rules') return null;
  if (provider !== 'gemini') {
    console.error(`Unsupported AI_PROVIDER "${provider}". Using the no-cost rules engine.`);
    return null;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('AI_PROVIDER is gemini but GEMINI_API_KEY is missing. Using the no-cost rules engine.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateAdvisorResponse(
  messages: ChatMessage[],
  attachments?: Array<{ name: string; url?: string }>
): Promise<AdvisorAnalysisResult> {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const rag = await retrieveRelevantKnowledge(lastUserMessage);

  const fullSystemInstruction = `${ADVISOR_SYSTEM_PROMPT}

TÀI LIỆU THAM KHẢO LIÊN QUAN (tối đa 8.000 ký tự):
${rag.text.slice(0, 8_000) || 'Chưa có tài liệu cụ thể cho câu hỏi này.'}
`;

  const ai = getGeminiClient();

  // Rules mode is the default so the site never incurs LLM charges unless explicitly enabled.
  if (ai) {
    try {
      const firstUserIndex = messages.findIndex((message) => message.role === 'user');
      const contents = messages.slice(Math.max(0, firstUserIndex)).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      // If attachments exist on the latest turn, append info
      if (attachments && attachments.length > 0) {
        const lastContent = contents[contents.length - 1];
        if (lastContent && lastContent.role === 'user') {
          const fileNote = `\n[Khách hàng đính kèm file: ${attachments.map(a => a.name).join(', ')}]`;
          lastContent.parts[0].text += fileNote;
        }
      }

      const response = await ai.models.generateContent({
        model: process.env.LLM_MODEL || 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.3,
          maxOutputTokens: 700,
        },
      });

      const rawText = response.text?.trim() || '';
      if (rawText) return parseAdvisorOutput(rawText, rag.sources);
      console.warn('Gemini returned an empty response; using the no-cost rules engine.');
    } catch (err) {
      console.error('Gemini API call failed; using the no-cost rules engine:', err);
    }
  }

  return generateIntelligentFallback(lastUserMessage, messages, rag.sources, attachments);
}

export function parseAdvisorOutput(rawText: string, sources: string[]): AdvisorAnalysisResult {
  const metadataMatch = rawText.match(/<METADATA>([\s\S]*?)<\/METADATA>/);
  let replyText = rawText;
  let metadata: any = {};

  if (metadataMatch) {
    replyText = rawText.replace(/<METADATA>[\s\S]*?<\/METADATA>/, '').trim();
    try {
      metadata = JSON.parse(metadataMatch[1].trim());
    } catch (e) {
      console.warn('Failed to parse advisor metadata JSON:', e);
    }
  }

  const leadScore = metadata.leadScore === 'HOT' || metadata.leadScore === 'COLD'
    ? metadata.leadScore
    : 'WARM';
  return {
    replyText: replyText || 'Dạ em chưa nhận được nội dung phản hồi. Anh/chị vui lòng thử lại hoặc gọi Vietlabel qua số 086 896 8089 ạ.',
    extractedFields: metadata.extractedFields && typeof metadata.extractedFields === 'object'
      ? metadata.extractedFields
      : {},
    missingFields: Array.isArray(metadata.missingFields)
      ? metadata.missingFields.filter((field: unknown): field is string => typeof field === 'string').slice(0, 12)
      : [],
    leadScore,
    needHuman: Boolean(metadata.needHuman),
    briefReady: Boolean(metadata.briefReady),
    sources,
  };
}

async function generateIntelligentFallback(
  latestMessage: string,
  history: ChatMessage[],
  sources: string[],
  attachments?: Array<{ name: string; url?: string }>,
): Promise<AdvisorAnalysisResult> {
  const userMessages = history.filter(message => message.role === 'user').map(message => message.content);
  const allCustomerText = userMessages.join('\n');
  const lower = allCustomerText.toLowerCase();
  const latestLower = latestMessage.toLowerCase();
  const approvedFaq = await findApprovedFaqAnswer(latestMessage);
  const extractedFields: Record<string, any> = {};
  const missingFields: string[] = [];

  const phoneMatch = allCustomerText.match(/(?:\+84|0)\d[\d\s.-]{8,13}\d/);
  const emailMatch = allCustomerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const qtyMatch = allCustomerText.match(/(\d[\d.,]*)\s*(cái|hộp|túi|tem|nhãn|cuộn|thùng|pcs|chiếc|bộ|bao)/i);
  const dimensionMatch = allCustomerText.match(/(?:\d+(?:[.,]\d+)?\s*(?:x|×|[*])\s*){1,2}\d+(?:[.,]\d+)?\s*(?:mm|cm|m)?/i);
  if (phoneMatch) extractedFields.contact = phoneMatch[0].replace(/\s+/g, '');
  if (emailMatch) extractedFields.email = emailMatch[0];
  if (qtyMatch) extractedFields.quantity = qtyMatch[0];
  if (dimensionMatch) extractedFields.dimensions = dimensionMatch[0];
  if (attachments?.length) extractedFields.hasDesignFile = true;

  if (/\btem\b|nhãn|decal|label/i.test(lower)) extractedFields.productType = 'Tem nhãn';
  else if (/hộp|carton|folding/i.test(lower)) extractedFields.productType = 'Hộp giấy';
  else if (/túi giấy|kraft/i.test(lower)) extractedFields.productType = 'Túi giấy';
  else if (/thùng|carton sóng/i.test(lower)) extractedFields.productType = 'Thùng carton';
  else if (/display|kệ trưng bày/i.test(lower)) extractedFields.productType = 'Kệ trưng bày';

  const explicitHandoff = /nhân viên|người thật|gọi lại|khiếu nại|gặp tư vấn viên/i.test(latestLower);
  const asksForQuote = /báo giá|xin giá|giá bao nhiêu|quote/i.test(lower);
  const briefReady = Boolean(
    extractedFields.productType
    && (extractedFields.quantity || extractedFields.dimensions)
    && (extractedFields.contact || extractedFields.email || asksForQuote),
  );
  const needHuman = explicitHandoff || briefReady;
  const leadScore: 'HOT' | 'WARM' | 'COLD' = briefReady ? 'HOT' : 'WARM';
  let replyText: string;

  if (approvedFaq) {
    replyText = `${approvedFaq.answer}\n\n${briefReady
      ? 'Nếu anh/chị cần báo giá theo quy cách cụ thể, em có thể chuyển yêu cầu đến bộ phận dự toán.'
      : 'Anh/chị muốn em tư vấn thêm theo sản phẩm hoặc số lượng dự kiến không ạ?'}`;
  } else if (explicitHandoff) {
    replyText = 'Dạ em đã ghi nhận yêu cầu kết nối. Anh/chị có thể gọi ngay hotline Vietlabel **086 896 8089** hoặc để lại số điện thoại/Zalo để chuyên viên liên hệ hỗ trợ ạ.';
  } else if (!extractedFields.productType) {
    missingFields.push('loại sản phẩm');
    replyText = 'Dạ Vietlabel có thể hỗ trợ từ tem nhãn đến hộp giấy, túi giấy và thùng carton. Anh/chị đang cần sản xuất loại bao bì hoặc tem nhãn nào ạ?';
  } else if (!extractedFields.quantity && !extractedFields.dimensions) {
    missingFields.push('số lượng hoặc kích thước');
    replyText = `Dạ em đã ghi nhận nhu cầu **${extractedFields.productType}**. Anh/chị dự kiến số lượng cần làm khoảng bao nhiêu, hoặc đã có kích thước sản phẩm chưa ạ?`;
  } else if (!extractedFields.contact && !extractedFields.email && !asksForQuote) {
    missingFields.push('thông tin liên hệ');
    replyText = 'Dạ em đã nắm được quy cách ban đầu. Anh/chị muốn để lại số điện thoại/Zalo hoặc email để chuyên viên gửi phương án và báo giá phù hợp không ạ?';
  } else {
    replyText = 'Dạ em đã tổng hợp thông tin ban đầu. Anh/chị có thể bấm **Gửi yêu cầu báo giá** bên dưới để chuyển thông tin cho bộ phận dự toán; chuyên viên sẽ kiểm tra quy cách và liên hệ xác nhận trước khi báo giá chính thức ạ.';
  }

  return {
    replyText,
    extractedFields,
    missingFields,
    leadScore,
    needHuman,
    briefReady,
    sources: approvedFaq
      ? [...new Set([...sources, approvedFaq.source])]
      : sources,
  };
}
