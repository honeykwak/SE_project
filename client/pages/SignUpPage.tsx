
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';
import { UserProfile } from '../types';

interface SignUpPageProps {
  onLogin: (user: UserProfile) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register({
        name,
        email,
        password,
        username: email.split('@')[0] // Default username
      });
      onLogin(data);
      navigate('/dashboard');
    } catch (error) {
      alert('회원가입 실패. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3D RIPPLE ENGINE ---
  const RippleContainer: React.FC<{ children: React.ReactNode; perspective?: string; rotation?: string; className?: string }> = ({
    children,
    perspective = "1000px",
    rotation = "rotateX(70deg)",
    className = ""
  }) => (
    <div className={`absolute ${className} w-[1000px] h-[800px] pointer-events-none z-0 flex items-center justify-center`}>
      <style>
        {`
                @keyframes ripple-synced {
                    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    49% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    50% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; border-width: 15px; } 
                    100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; border-width: 0px; }
                }
                @keyframes impact-bounce {
                    0%, 100% { transform: translateY(-80px) rotate(12deg); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(60px) rotate(12deg); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
            `}
      </style>
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          perspective: perspective,
          transform: rotation
        }}
      >
        {children}
      </div>
    </div>
  );

  const DeepRipple = () => (
    <RippleContainer rotation="rotateX(75deg)" className="top-[125%] left-[80%] -translate-x-1/2 -translate-y-1/2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border-blue-900/10 shadow-[0_10px_40px_rgba(30,58,138,0.2)]"
          style={{
            width: '1600px',
            height: '1600px',
            animation: `ripple-synced 4s ease-out infinite`,
            animationDelay: `${i * 0.15}s`,
            transform: 'translate(-50%, -50%) scale(0.1)',
            borderColor: 'rgba(37, 99, 235, 0.4)'
          }}
        />
      ))}
    </RippleContainer>
  );

  const MotionBackground = () => (
    <div className="absolute inset-0 overflow-hidden bg-stone-50 pointer-events-none z-0">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50/50 to-stone-50"></div>
      <div className="absolute bottom-[25%] right-[20%] w-64 h-72 hidden md:flex items-center justify-center z-20">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <DeepRipple />
        </div>
        <div className="relative w-full h-full bg-blue-600 rounded-2xl shadow-2xl shadow-blue-900/20 transform flex items-center justify-center z-20 animate-[impact-bounce_4s_infinite]">
          <div className="text-white text-6xl font-bold opacity-20 select-none">Sync.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:justify-start relative font-sans text-stone-900 overflow-hidden p-6 md:p-0">

      <MotionBackground />

      <div className="relative z-30 w-full max-w-[400px] md:ml-16 lg:ml-28 flex flex-col justify-center animate-in fade-in slide-in-from-left-8 duration-700">

        <div className="text-center md:text-left mb-8">
          <div
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 cursor-pointer mb-6 transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} /> 로그인으로 돌아가기
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">회원가입</h1>
          <p className="text-stone-500 text-sm font-medium leading-relaxed">
            프리랜서 여정을 <span className="text-blue-600 font-bold">SyncUp</span>과 함께 시작하세요.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력해주세요"
                className="w-full px-4 py-3 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="w-full px-4 py-3 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-stone-900 text-white font-bold py-3.5 rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : '가입하기'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-stone-500">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-bold hover:underline"
            >
              로그인
            </button>
          </div>

        </div>

        <div className="text-center md:text-left mt-8 text-xs text-stone-400 font-medium pl-1">
          © 2025 SyncUp. All rights reserved.
        </div>
      </div>

    </div>
  );
};

