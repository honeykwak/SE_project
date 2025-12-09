
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import authService from '../services/authService';
import { UserProfile } from '../types';
import { GoogleLogin } from '@react-oauth/google'; // Added

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

// --- 3D RIPPLE ENGINE ---
const RippleContainer: React.FC<{ children: React.ReactNode; perspective?: string; rotation?: string; className?: string }> = ({
  children,
  perspective = "1000px",
  rotation = "rotateX(70deg)",
  className = ""
}) => (
  <div className={`absolute ${className} w-[1000px] h-[800px] pointer-events-none z-0 flex items-center justify-center`}>
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

import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToast(); // Renamed to avoid loop

  // Toggle State
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for signup
  const [username, setUsername] = useState(''); // Only for signup
  const [confirmPassword, setConfirmPassword] = useState(''); // Only for signup

  const [isLoading, setIsLoading] = useState(false);

  // Reset form when switching modes
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setUsername('');
    setConfirmPassword('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN MODE
        const data = await authService.login({ email, password });
        onLogin(data);
        toastSuccess('환영합니다!');
        navigate('/dashboard');
      } else {
        // SIGNUP MODE
        if (password !== confirmPassword) {
          toastError('비밀번호가 일치하지 않습니다.');
          setIsLoading(false);
          return;
        }

        // Simple validation
        if (!name || !email || !password || !username) {
          toastError('모든 필드를 입력해주세요.');
          setIsLoading(false);
          return;
        }

        const data = await authService.register({
          name,
          email,
          password,
          username // Use explicit username
        });
        onLogin(data);
        toastSuccess('회원가입이 완료되었습니다.');
        navigate('/dashboard');
      }
    } catch (error) {
      toastError(isLogin ? '로그인 실패: 정보를 확인해주세요.' : '회원가입 실패: 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const data = await authService.googleLogin(credential);
      onLogin(data);
      toastSuccess('구글 로그인 성공!');
      navigate('/dashboard');
    } catch (error) {
      toastError('구글 로그인 실패');
    }
  };

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
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-3">{isLogin ? 'SyncUp.' : '회원가입'}</h1>
          <p className="text-stone-600 text-base font-medium leading-relaxed">
            {isLogin ? (
              <>
                <span className="text-blue-600 font-bold">개인 가용성 허브 서비스</span><br />
                기업과 프리랜서를 잇는 최적의 솔루션
              </>
            ) : (
              <>
                프리랜서 여정을 <span className="text-blue-600 font-bold">SyncUp</span>과 함께 시작하세요.
              </>
            )}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8 transition-all duration-300">
          <form onSubmit={handleAuth} className="space-y-4">

            {/* Name Field (Signup Only) */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">이름</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">아이디 (URL용)</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="english_only"
                    className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">아이디 (이메일)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8자 이상 입력해주세요"
                className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
              />
            </div>

            {/* Confirm Password (Signup Only) */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
                />
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? '로그인' : '가입하기')}
              </button>
            </div>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center text-sm font-medium text-stone-500">
            {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
            <button
              onClick={toggleMode}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </div>


          {/* Social Login (Only show on Login mode for simplicity, or both) */}
          {isLogin && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-300/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/50 px-3 text-stone-400 font-bold backdrop-blur-sm rounded-full">또는</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toastError('구글 로그인 실패')}
                  useOneTap
                />
              </div>
            </>
          )}

        </div>

        <div className="text-center md:text-left mt-8 text-xs text-stone-400 font-medium pl-1">
          © 2025 SyncUp. All rights reserved. • <button onClick={() => navigate('/info')} className="hover:underline">About</button>
        </div>
      </div>

    </div>
  );
};
