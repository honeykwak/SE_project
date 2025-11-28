import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import type { CreateProjectData, Project } from '../../types/project';
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

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectData) => void;
  initialData?: Project | null;
  isLoading?: boolean;
}

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }: ProjectModalProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<CreateProjectData>();

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      // Date 객체거나 ISO string일 수 있음. YYYY-MM-DD 포맷으로 변환 필요
      setValue('startDate', initialData.startDate.split('T')[0]);
      setValue('endDate', initialData.endDate.split('T')[0]);
      setValue('status', initialData.status);
      setValue('description', initialData.description);
    } else {
      reset({
        title: '',
        startDate: '',
        endDate: '',
        status: 'active',
        description: '',
      });
    }
  }, [initialData, setValue, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>{initialData ? '프로젝트 수정' : '새 프로젝트 추가'}</Title>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="프로젝트 제목"
            placeholder="제목을 입력하세요"
            {...register('title', { required: true })}
          />
          <div style={{ display: 'flex', gap: '16px' }}>
            <Input
              label="시작 날짜"
              type="date"
              {...register('startDate', { required: true })}
            />
            <Input
              label="종료 날짜"
              type="date"
              {...register('endDate', { required: true })}
            />
          </div>
          {/* 상태 선택은 간단히 select로 구현 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <label style={{ fontSize: '14px', fontWeight: 500 }}>상태</label>
             <select 
                {...register('status')}
                style={{ 
                    height: '48px', 
                    padding: '0 16px', 
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0' 
                }}
             >
                 <option value="planning">기획중</option>
                 <option value="active">진행중</option>
                 <option value="completed">완료</option>
             </select>
          </div>

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

export default ProjectModal;

