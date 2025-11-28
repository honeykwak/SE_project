import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthLayout from '../components/auth/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useState } from 'react';
import { registerUser } from '../api/auth';
import type { RegisterCredentials } from '../types/auth';

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

  return (
    <AuthLayout title="회원가입">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요"
          error={errors.name?.message as string}
          {...register('name', { required: '이름은 필수 입력입니다.' })}
        />
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
          label="아이디 (페이지 주소)"
          type="text"
          placeholder="영문 소문자, 숫자만 가능"
          error={errors.username?.message as string}
          {...register('username', {
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
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          error={errors.password?.message as string}
          {...register('password', {
            required: '비밀번호는 필수 입력입니다.',
            minLength: {
              value: 6,
              message: '비밀번호는 최소 6자 이상이어야 합니다.',
            },
          })}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          error={errors.confirmPassword?.message as string}
          {...register('confirmPassword', {
            required: '비밀번호 확인은 필수 입력입니다.',
            validate: (value) =>
              value === password || '비밀번호가 일치하지 않습니다.',
          })}
        />
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </Button>
      </Form>
      <FooterText>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </FooterText>
    </AuthLayout>
  );
};

export default RegisterPage;

