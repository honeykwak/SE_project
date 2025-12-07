
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser } from '../api/auth';
import type { RegisterCredentials } from '../types/auth';
import { Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...credentials } = data;
      const response = await registerUser(credentials as RegisterCredentials);
      console.log('Register Success:', response);
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, type, placeholder, error, registration }: any) => (
    <div>
      <label className="block text-xs font-bold text-stone-900 mb-1.5 ml-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="w-full px-4 py-3.5 bg-white/80 border border-stone-200/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400 text-sm hover:bg-white text-stone-900"
      />
      {error && <span className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</span>}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-sans text-stone-900 overflow-hidden bg-stone-50 p-6">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50/50 to-stone-50"></div>
      </div>

      <div className="relative z-30 w-full max-w-md flex flex-col justify-center animate-in fade-in zoom-in duration-500">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-stone-900 mb-2">회원가입</h1>
          <p className="text-stone-500 text-sm">SyncUp과 함께 프리랜서 여정을 시작하세요.</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="이름"
              type="text"
              placeholder="이름을 입력해주세요"
              error={errors.name?.message}
              registration={register('name', { required: '이름은 필수 입력입니다.' })}
            />
            <InputField
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              error={errors.email?.message}
              registration={register('email', {
                required: '이메일은 필수 입력입니다.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: '유효한 이메일 형식이 아닙니다.',
                },
              })}
            />
            <InputField
              label="아이디 (페이지 주소)"
              type="text"
              placeholder="영문 소문자, 숫자만 가능"
              error={errors.username?.message}
              registration={register('username', {
                required: '아이디는 필수 입력입니다.',
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: '아이디는 영문 소문자와 숫자만 사용할 수 있습니다.',
                },
                minLength: {
                  value: 3,
                  message: '아이디는 최소 3자 이상이어야 합니다.',
                },
              })}
            />
            <InputField
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              error={errors.password?.message}
              registration={register('password', {
                required: '비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 6,
                  message: '비밀번호는 최소 6자 이상이어야 합니다.',
                },
              })}
            />
            <InputField
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.confirmPassword?.message}
              registration={register('confirmPassword', {
                required: '비밀번호 확인은 필수 입력입니다.',
                validate: (value: string) =>
                  value === password || '비밀번호가 일치하지 않습니다.',
              })}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : '회원가입'}
              </button>
            </div>
          </form>

          <div className="pt-6 mt-6 border-t border-stone-200/60 text-center">
            <p className="text-stone-500 text-sm font-medium">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
