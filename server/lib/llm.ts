import { GoogleGenAI } from '@google/genai';
import { ADVISOR_SYSTEM_PROMPT } from '../prompts/advisor';
import { retrieveRelevantKnowledge } from './rag';

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
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateAdvisorResponse(
  messages: ChatMessage[],
  attachments?: Array<{ name: string; url?: string }>
): Promise<AdvisorAnalysisResult> {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const rag = retrieveRelevantKnowledge(lastUserMessage);

  const fullSystemInstruction = `${ADVISOR_SYSTEM_PROMPT}

KNOWLEDGE BASE TÀI LIỆU SẢN XUẤT VIETLABEL (CHỈ TRẢ LỜI DỰA TRÊN ĐÂY):
${rag.text}
`;

  const ai = getGeminiClient();

  // If Gemini client is available, call the real API
  if (ai) {
    try {
      const contents = messages.map(m => ({
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
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: 0.3,
        },
      });

      const rawText = response.text || '';
      return parseAdvisorOutput(rawText, rag.sources);
    } catch (err) {
      console.error('Gemini API call failed, using intelligent rule-based engine:', err);
    }
  }

  // Fallback intelligent rule-based engine when API key is missing or network drop occurs
  return generateIntelligentFallback(lastUserMessage, messages, rag.sources);
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

  return {
    replyText,
    extractedFields: metadata.extractedFields || {},
    missingFields: metadata.missingFields || [],
    leadScore: metadata.leadScore || 'WARM',
    needHuman: Boolean(metadata.needHuman),
    briefReady: Boolean(metadata.briefReady),
    sources,
  };
}

function generateIntelligentFallback(
  latestMessage: string,
  history: ChatMessage[],
  sources: string[]
): AdvisorAnalysisResult {
  const lower = latestMessage.toLowerCase();
  const extractedFields: Record<string, any> = {};
  const missingFields: string[] = [];

  // Check phone / contact
  const phoneMatch = latestMessage.match(/(0\d{9,10}|\+84\d{9,10})/);
  if (phoneMatch) extractedFields.contact = phoneMatch[0];

  // Check email
  const emailMatch = latestMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) extractedFields.email = emailMatch[0];

  // Check quantity
  const qtyMatch = latestMessage.match(/(\d+[\d.,]*)\s*(cái|hộp|túi|tem|nhãn|cuộn|thùng|pcs|chiếc)/i);
  if (qtyMatch) extractedFields.quantity = qtyMatch[0];

  // Check product types
  if (lower.includes('tem') || lower.includes('nhãn') || lower.includes('decal')) {
    extractedFields.productType = 'Tem nhãn Decal cuộn';
  } else if (lower.includes('hộp')) {
    extractedFields.productType = 'Hộp giấy';
  } else if (lower.includes('túi')) {
    extractedFields.productType = 'Túi giấy Kraft';
  } else if (lower.includes('thùng') || lower.includes('carton')) {
    extractedFields.productType = 'Thùng carton';
  }

  // Need human trigger
  const needHuman = lower.includes('nhân viên') || lower.includes('người thật') || lower.includes('báo giá gấp') || lower.includes('khiếu nại');

  let replyText = '';
  let leadScore: 'HOT' | 'WARM' | 'COLD' = 'WARM';

  if (needHuman) {
    leadScore = 'HOT';
    replyText = `Dạ em đã ghi nhận yêu cầu của anh/chị. Chuyên viên kinh doanh Vietlabel đang sẵn sàng kết nối ngay qua Hotline **086 896 8089** hoặc Zalo để hỗ trợ anh/chị tức thì!`;
  } else if (!extractedFields.productType) {
    missingFields.push('loại sản phẩm', 'kích thước hoặc số lượng', 'thông tin liên hệ');
    replyText = `Dạ chào anh/chị! Em là trợ lý tư vấn bao bì & tem nhãn của Vietlabel. 

Để em hỗ trợ tư vấn quy cách và vật liệu phù hợp nhất, anh/chị có thể chia sẻ giúp em:
(1) Anh/chị đang cần làm **loại bao bì hay tem nhãn** nào (ví dụ: tem decal dầu nhớt/mỹ phẩm, hộp cứng cao cấp, túi giấy hay thùng carton)?
(2) Sản phẩm của anh/chị dán lên bề mặt gì hoặc đựng trong môi trường nào (nhiệt độ thường, kho lạnh, tiếp xúc dầu mỡ/nước)?
(3) Dự kiến số lượng anh/chị cần in là bao nhiêu ạ?`;
  } else if (!extractedFields.quantity) {
    missingFields.push('số lượng', 'kích thước', 'thông tin liên hệ');
    replyText = `Dạ Vietlabel hoàn toàn có dây chuyền in Flexo & Offset chuyên sâu cho **${extractedFields.productType}** đạt chuẩn ISO 9001 và G7 Master ạ!

Anh/chị cho em xin thêm một vài thông tin để dự toán kỹ thuật lên phương án tối ưu chi phí nhé:
(1) Dự kiến số lượng anh/chị cần in là bao nhiêu (MOQ tem cuộn từ 1.000 - 2.000 nhãn, hộp giấy từ 500 - 1.000 cái)?
(2) Kích thước ước tính (Dài x Rộng x Cao hoặc đường kính tem)?
(3) Anh/chị đã có sẵn file thiết kế in ấn (AI, PDF) chưa ạ?`;
  } else {
    leadScore = extractedFields.contact ? 'HOT' : 'WARM';
    replyText = `Dạ tuyệt vời ạ! Em đã ghi nhận nhu cầu in **${extractedFields.productType}** với số lượng **${extractedFields.quantity}**.

Anh/chị vui lòng để lại **Số điện thoại/Zalo** hoặc Email để bộ phận dự toán Vietlabel gửi bảng báo giá chính xác kèm chiết khấu tốt nhất và phương án mẫu thử trong vòng 2 giờ nhé ạ!`;
  }

  const briefReady = Boolean(extractedFields.productType && (extractedFields.quantity || extractedFields.contact));

  return {
    replyText,
    extractedFields,
    missingFields,
    leadScore,
    needHuman,
    briefReady,
    sources,
  };
}
