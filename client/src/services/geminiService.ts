
import { GoogleGenAI } from "@google/genai";

// Use import.meta.env for Vite environment variables
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const generatePortfolioDescription = async (title: string, category: string, keywords: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `당신은 전문적인 프리랜서 포트폴리오를 위한 UX 카피라이터입니다. 
      포트폴리오 프로젝트에 대한 간결하고 매력적이며 전문적인 2문장 분량의 설명을 한국어로 작성해 주세요.
      
      프로젝트 제목: ${title}
      카테고리: ${category}
      키워드/맥락: ${keywords}
      
      어조: 세련되고 자신감 있으면서도 겸손하게. 과도한 유행어는 피하세요.`,
        });

        return response.text?.trim() || "설명을 생성하지 못했습니다.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "지금은 설명을 생성할 수 없습니다.";
    }
};

export const generateReplyDraft = async (messageContent: string, tone: 'professional' | 'friendly'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `클라이언트의 문의에 대한 짧은 이메일 답장을 한국어로 작성해 주세요.
            
            클라이언트 메시지: "${messageContent}"
            
            원하는 어조: ${tone === 'professional' ? '격식 있고 정중한 비즈니스 톤' : '친근하고 부드러운 톤'}
            구조: 연락에 대한 감사 인사, 내용 확인 언급, 그리고 다음 주 화요일 통화 제안을 포함하세요.
            `,
        });
        return response.text?.trim() || "초안을 생성하지 못했습니다.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "초안 생성 중 오류가 발생했습니다.";
    }
}
