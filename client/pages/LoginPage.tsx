
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import authService from '../services/authService';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@syncup.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      onLogin(data); // Update App state
      navigate('/dashboard');
    } catch (error) {
      alert('로그인 실패: 아이디와 비밀번호를 확인해주세요.');
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
                /* Synced Ripple for Deep Resonance */
                @keyframes ripple-synced {
                    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    49% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    50% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; border-width: 15px; } /* Impact Moment */
                    100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; border-width: 0px; }
                }
                /* Card Impact Bounce - Fixed Rotation, Vertical Drop */
                @keyframes impact-bounce {
                    0%, 100% { transform: translateY(-80px) rotate(12deg); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(60px) rotate(12deg); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } /* Hits water at 50% */
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

  // Deep Resonance (Synced)
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

      {/* Floating Abstract Card */}
      <div className="absolute top-[20%] right-[10%] w-72 h-48 bg-white rounded-2xl shadow-xl border border-blue-100 opacity-80 transform rotate-[-6deg] animate-[bounce_6s_infinite] hidden md:block z-10">
        <div className="p-6 space-y-4">
          <div className="h-3 w-1/3 bg-stone-200 rounded"></div>
          <div className="h-3 w-full bg-stone-100 rounded"></div>
          <div className="h-3 w-2/3 bg-stone-100 rounded"></div>
        </div>
      </div>

      {/* Anchor Container */}
      <div className="absolute bottom-[25%] right-[20%] w-64 h-72 hidden md:flex items-center justify-center z-20">
        {/* Ripple */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <DeepRipple />
        </div>
        {/* Card */}
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

        {/* Brand Header */}
        <div className="text-center md:text-left mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 mb-6 md:mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16l5 5" />
              <path d="M21 21v-5h-5" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-3">SyncUp.</h1>
          <p className="text-stone-600 text-base font-medium leading-relaxed">
            <span className="text-blue-600 font-bold">개인 가용성 허브 서비스</span><br />
            기업과 프리랜서를 잇는 최적의 솔루션
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">아이디</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="아이디를 입력해 주세요."
                className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요."
                className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : '로그인'}
              </button>
            </div>
          </form>

          {/* Divider with Text */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/50 px-3 text-stone-400 font-bold backdrop-blur-sm rounded-full">또는</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white text-stone-600 border border-stone-200 font-bold py-3.5 rounded-xl hover:bg-stone-50 transition-colors text-sm flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google 계정으로 계속하기
            </button>
          </div>

          {/* Sign Up Text Link */}
          <div className="mt-6 text-center text-sm font-medium text-stone-500">
            아직 계정이 없으신가요?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 font-bold hover:underline"
            >
              회원가입
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center md:text-left mt-8 text-xs text-stone-400 font-medium pl-1">
          © 2024 SyncUp. All rights reserved.
        </div>
      </div>

    </div>
  );
};
