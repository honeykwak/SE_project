import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useState } from 'react';
import { login } from '../api/auth';
import type { LoginCredentials } from '../types/auth';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.gray600};

  a {
    color: ${({ theme }) => theme.colors.primary.main};
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await login(data as LoginCredentials);
      console.log('Login Success:', response);
      localStorage.setItem('token', response.token); // 토큰 저장
      navigate('/dashboard'); 
      // alert(`로그인 성공! 환영합니다, ${response.name}님.`);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="로그인">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          error={errors.email?.message as string}
          {...register('email', {
            required: '이메일은 필수 입력입니다.',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '유효한 이메일 형식이 아닙니다.',
            },
          })}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message as string}
          {...register('password', {
            required: '비밀번호는 필수 입력입니다.',
          })}
        />
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>
      </Form>
      <FooterText>
        아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
      </FooterText>
    </AuthLayout>
  );
};

export default LoginPage;

