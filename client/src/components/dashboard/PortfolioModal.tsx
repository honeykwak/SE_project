import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import type { CreatePortfolioData, PortfolioItem } from '../../types/portfolio';
import { useEffect } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePortfolioData) => void;
  initialData?: PortfolioItem | null;
  isLoading?: boolean;
}

const PortfolioModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: PortfolioModalProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<CreatePortfolioData>();

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('description', initialData.description);
      setValue('imageUrl', initialData.imageUrl);
      setValue('projectLink', initialData.projectLink);
    } else {
      reset({
        title: '',
        description: '',
        imageUrl: '',
        projectLink: '',
      });
    }
  }, [initialData, setValue, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>{initialData ? '포트폴리오 수정' : '새 포트폴리오 추가'}</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="제목"
            placeholder="작업물 제목을 입력하세요"
            {...register('title', { required: true })}
          />
          <Input
            label="설명"
            placeholder="간단한 설명을 입력하세요"
            {...register('description')}
          />
          <Input
            label="이미지 URL"
            placeholder="https://example.com/image.jpg"
            {...register('imageUrl')}
          />
          <Input
            label="프로젝트 링크"
            placeholder="https://behance.net/..."
            {...register('projectLink')}
          />

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalCard>
    </Overlay>
  );
};

export default PortfolioModal;

