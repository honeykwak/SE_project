
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, Zap, Waves, Droplets } from 'lucide-react';
import { apiService } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ripple Variant State (1: Glassy, 2: Deep, 3: Energy)
  const [rippleVariant, setRippleVariant] = useState<1 | 2 | 3>(1);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('token', response.token);
      const { token, ...userData } = response;
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3D RIPPLE ENGINE ---

  // Adjusted container: Now positions relative to the PARENT wrapper, not the viewport
  const RippleContainer: React.FC<{ children: React.ReactNode; perspective?: string; rotation?: string; className?: string }> = ({
    children,
    perspective = "1000px",
    rotation = "rotateX(70deg)",
    className = ""
  }) => (
    <div className={`absolute ${className} w-[1000px] h-[800px] pointer-events-none z-0 flex items-center justify-center`}>
      <style>
        {`
                @keyframes ripple-expand {
                    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.8; box-shadow: 0 0 10px rgba(59,130,246,0.5), inset 0 0 10px rgba(59,130,246,0.5); }
                    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; box-shadow: 0 0 2px rgba(59,130,246,0), inset 0 0 2px rgba(59,130,246,0); }
                }
                /* Synced Ripple for Deep Resonance */
                @keyframes ripple-synced {
                    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    49% { transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-width: 0px; }
                    50% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; border-width: 15px; } /* Impact Moment */
                    100% { transform: translate(-50%, -50%) scale(3.5); opacity: 0; border-width: 0px; }
                }
                @keyframes ripple-expand-energy {
                    0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(3.0); opacity: 0; }
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

  // V1: Glassy Drop
  const GlassyRipple = () => (
    <RippleContainer className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border border-blue-400/50 bg-blue-400/5"
          style={{
            width: '1200px',
            height: '1200px',
            animation: `ripple-expand 4s linear infinite`,
            animationDelay: `${i * 0.8}s`,
            transform: 'translate(-50%, -50%) scale(0.1)',
          }}
        />
      ))}
      <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-blue-500 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.8)] animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
    </RippleContainer>
  );

  // V2: Deep Resonance (Synced)
  const DeepRipple = () => (
    // Anchored to the bottom center of the card
    // Lowered further to top-[125%] and moved right to left-[80%] to align with impact corner
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

  // V3: High Energy
  const EnergyRipple = () => (
    <RippleContainer rotation="rotateX(75deg) rotateZ(10deg)" className="top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border-2 border-cyan-400/40"
          style={{
            width: '800px',
            height: '800px',
            animation: `ripple-expand-energy 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite`,
            animationDelay: `${i * 0.3}s`,
            transform: 'translate(-50%, -50%) scale(0.1)',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.2)'
          }}
        />
      ))}
    </RippleContainer>
  );

  const MotionBackground = () => (
    <div className="absolute inset-0 overflow-hidden bg-stone-50 pointer-events-none z-0">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50/50 to-stone-50"></div>

      {/* Floating Abstract Card - Background Decoration */}
      <div className="absolute top-[20%] right-[10%] w-72 h-48 bg-white rounded-2xl shadow-xl border border-blue-100 opacity-80 transform rotate-[-6deg] animate-[bounce_6s_infinite] hidden md:block z-10">
        <div className="p-6 space-y-4">
          <div className="h-3 w-1/3 bg-stone-200 rounded"></div>
          <div className="h-3 w-full bg-stone-100 rounded"></div>
          <div className="h-3 w-2/3 bg-stone-100 rounded"></div>
        </div>
      </div>

      {/* 
            ANCHOR CONTAINER: 
            Holds both the Card and the Ripple together.
            Moving this container moves both elements, keeping them aligned regardless of aspect ratio.
        */}
      <div className="absolute bottom-[25%] right-[20%] w-64 h-72 hidden md:flex items-center justify-center z-20">

        {/* 1. The Ripple Effect (Rendered BEHIND the card, anchored to this container) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          {rippleVariant === 1 && <GlassyRipple />}
          {rippleVariant === 2 && <DeepRipple />}
          {rippleVariant === 3 && <EnergyRipple />}
        </div>

        {/* 2. The Sync Card (Rendered ABOVE the ripple) */}
        <div
          className={`relative w-full h-full bg-blue-600 rounded-2xl shadow-2xl shadow-blue-900/20 transform flex items-center justify-center z-20 ${rippleVariant === 2
            ? 'animate-[impact-bounce_4s_infinite]' // Synced impact for V2
            : 'animate-[bounce_8s_infinite] rotate-[12deg]' // Standard float
            }`}
        >
          <div className="text-white text-6xl font-bold opacity-20 select-none">Sync.</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:justify-start relative font-sans text-stone-900 overflow-hidden p-6 md:p-0">

      {/* Full Screen Background Layer */}
      <MotionBackground />

      {/* Main Container */}
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
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해 주세요."
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

            <div className="pt-3 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : '로그인'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full bg-white text-stone-600 border border-stone-200 font-bold py-3.5 rounded-xl hover:bg-stone-50 transition-colors text-sm"
              >
                회원가입
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="pt-6 mt-6 border-t border-stone-200/60 text-center">
            <button
              onClick={() => navigate('/page/alex-design')}
              className="text-xs text-stone-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 font-medium group"
            >
              클라이언트 입장에서 데모 보기 (User ID 필요)
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-left mt-8 text-xs text-stone-400 font-medium pl-1">
          © 2024 SyncUp. All rights reserved.
        </div>
      </div>

      {/* Ripple Effect Selector */}
      <div className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur border border-stone-200 p-2 rounded-xl shadow-lg flex gap-2">
        <button
          onClick={() => setRippleVariant(1)}
          className={`p-2 rounded-lg transition-colors ${rippleVariant === 1 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500'}`}
          title="Glassy Drop"
        >
          <Droplets size={20} />
        </button>
        <button
          onClick={() => setRippleVariant(2)}
          className={`p-2 rounded-lg transition-colors ${rippleVariant === 2 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500'}`}
          title="Deep Resonance (Synced)"
        >
          <Waves size={20} />
        </button>
        <button
          onClick={() => setRippleVariant(3)}
          className={`p-2 rounded-lg transition-colors ${rippleVariant === 3 ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500'}`}
          title="High Energy"
        >
          <Zap size={20} />
        </button>
      </div>

    </div>
  );
};
