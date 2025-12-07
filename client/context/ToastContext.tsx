import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

// --- Types ---
type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

// --- Context ---
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// --- Component ---
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300); // Wait for animation
    };

    // Auto-dismiss
    React.useEffect(() => {
        const timer = setTimeout(handleRemove, 4000);
        return () => clearTimeout(timer);
    }, []);

    const bgColors = {
        success: 'bg-white/90 border-green-200 text-green-800',
        error: 'bg-white/90 border-red-200 text-red-800',
        info: 'bg-white/90 border-blue-200 text-blue-800',
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <AlertCircle className="w-5 h-5 text-blue-500" />,
    };

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border backdrop-blur-md
        transition-all duration-300 transform 
        ${isExiting ? 'opacity-0 translate-y-[-20px] scale-95' : 'opacity-100 translate-y-0 scale-100'}
        ${bgColors[toast.type]}
        min-w-[300px] max-w-md
      `}
            role="alert"
        >
            <div className="flex-shrink-0">{icons[toast.type]}</div>
            <p className="text-sm font-semibold flex-1">{toast.message}</p>
            <button
                onClick={handleRemove}
                className="p-1 rounded-full hover:bg-black/5 transition-colors text-stone-400 hover:text-stone-600"
            >
                <X size={16} />
            </button>
        </div>
    );
};

// --- Provider ---
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
    const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, success, error, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-0 left-0 z-[9999] flex flex-col items-center gap-3 pointer-events-none p-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto animate-in slide-in-from-top-4 duration-300">
                        <ToastItem toast={toast} onRemove={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// --- Hook ---
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
