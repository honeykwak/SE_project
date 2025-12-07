import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { generatePortfolioDescription } from '../services/geminiService';

export const AIAssistant: React.FC<{
  onAccept: (text: string) => void;
  contextTitle: string;
}> = ({ onAccept, contextTitle }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [keywords, setKeywords] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!keywords) return;
    setLoading(true);
    const text = await generatePortfolioDescription(contextTitle, 'Design', keywords);
    setResult(text);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors mt-2"
      >
        <Sparkles size={14} /> AI 설명 생성하기
      </button>
    );
  }

  return (
    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
         <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
            <Sparkles size={12} /> Gemini 카피라이터
         </span>
         <button onClick={() => setIsOpen(false)} className="text-xs text-blue-400 hover:text-blue-700">닫기</button>
      </div>
      
      {!result ? (
        <div className="flex gap-2">
            <input 
                type="text" 
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="키워드 입력 (예: 미니멀, 사용자 중심)..."
                className="flex-1 text-xs p-2 rounded border border-blue-200 focus:outline-none focus:border-blue-500 text-stone-900"
            />
            <button 
                onClick={handleGenerate}
                disabled={loading || !keywords}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {loading ? <Loader2 size={14} className="animate-spin" /> : '생성'}
            </button>
        </div>
      ) : (
        <div className="space-y-2">
            <p className="text-sm text-blue-900 italic bg-white p-2 rounded border border-blue-100">"{result}"</p>
            <div className="flex gap-2">
                <button 
                    onClick={() => onAccept(result)}
                    className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1 hover:bg-blue-700"
                >
                    <Check size={12} /> 적용하기
                </button>
                <button 
                    onClick={() => setResult(null)}
                    className="flex-1 bg-white text-blue-600 border border-blue-200 text-xs py-1.5 rounded hover:bg-blue-50"
                >
                    다시 시도
                </button>
            </div>
        </div>
      )}
    </div>
  );
};