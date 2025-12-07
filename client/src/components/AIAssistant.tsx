
import React, { useState } from 'react';
import { Sparkles, Loader2, StopCircle, RefreshCw, Check } from 'lucide-react';
import { generatePortfolioDescription } from '../services/geminiService';

interface AIAssistantProps {
    contextTitle: string;
    onAccept: (text: string) => void;
    className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ contextTitle, onAccept, className = '' }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedText, setGeneratedText] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const handleGenerate = async () => {
        if (!contextTitle) return;
        setIsGenerating(true);
        setShowPreview(true);

        // Simulate thinking time for better UX
        setTimeout(async () => {
            const text = await generatePortfolioDescription(contextTitle, 'Design', 'professional, modern, user-centric');
            setGeneratedText(text);
            setIsGenerating(false);
        }, 800);
    };

    const handleApply = () => {
        onAccept(generatedText);
        setShowPreview(false);
        setGeneratedText('');
    };

    const handleCancel = () => {
        setShowPreview(false);
        setGeneratedText('');
        setIsGenerating(false);
    };

    return (
        <div className={`mt-2 ${className}`}>
            {!showPreview ? (
                <button
                    onClick={handleGenerate}
                    disabled={!contextTitle}
                    className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles size={14} />
                    {contextTitle ? 'AI로 설명 자동 생성' : '제목을 입력하면 AI가 설명을 써드려요'}
                </button>
            ) : (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-blue-600" />
                            <span className="text-xs font-bold text-blue-800">AI 제안</span>
                        </div>
                        {!isGenerating && (
                            <div className="flex gap-1">
                                <button onClick={handleGenerate} className="p-1 hover:bg-blue-100 rounded-lg text-blue-600" title="다시 생성">
                                    <RefreshCw size={14} />
                                </button>
                                <button onClick={handleCancel} className="p-1 hover:bg-red-100 rounded-lg text-red-500" title="취소">
                                    <StopCircle size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {isGenerating ? (
                        <div className="py-4 flex flex-col items-center justify-center text-blue-600 gap-2">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-xs font-medium animate-pulse">마법으 부리는 중...</span>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-stone-700 leading-relaxed font-medium mb-3 bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                {generatedText}
                            </p>
                            <button
                                onClick={handleApply}
                                className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                            >
                                <Check size={14} /> 설명에 적용하기
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
