import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { DateRange } from 'react-date-range';
import type { RangeKeyDict } from 'react-date-range'; // type-only import
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { ko } from 'date-fns/locale'; // 한국어 로케일

import Button from '../common/Button';
import Input from '../common/Input';
import type { CreateProjectData, Project } from '../../types/project';
import { useEffect, useState } from 'react';

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
  background-color: ${({ theme }) => theme.colors.neutral.white};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-height: 90vh; // 화면보다 작게
  overflow-y: auto; // 스크롤 허용
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.headings.h3.size};
  font-weight: ${({ theme }) => theme.typography.headings.h3.weight};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.neutral.black};
  margin-bottom: 4px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DateRangeContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  display: flex;
  justify-content: center;
  
  .rdrDateDisplayWrapper {
    background-color: transparent;
  }
  .rdrMonthAndYearWrapper {
     padding-top: 0;
     height: 40px;
  }
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
  
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('status', initialData.status);
      setValue('description', initialData.description);
      
      // Date Range 초기화
      setDateRange([{
        startDate: new Date(initialData.startDate),
        endDate: new Date(initialData.endDate),
        key: 'selection'
      }]);
    } else {
      reset({
        title: '',
        startDate: '', // form state는 나중에 채움
        endDate: '',
        status: 'active',
        description: '',
      });
      setDateRange([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }]);
    }
  }, [initialData, setValue, reset, isOpen]);

  const handleFormSubmit = (data: CreateProjectData) => {
    // DateRange 값을 Form Data에 병합
    const payload = {
      ...data,
      startDate: dateRange[0].startDate.toISOString(), // 백엔드로 보낼 땐 ISO String
      endDate: dateRange[0].endDate.toISOString(),
    };
    onSubmit(payload);
  };

  const handleDateChange = (item: RangeKeyDict) => {
    setDateRange([item.selection as any]);
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>{initialData ? '프로젝트 수정' : '새 프로젝트 추가'}</Title>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Input
            label="프로젝트 제목"
            placeholder="제목을 입력하세요"
            {...register('title', { required: true })}
          />
          
          <div>
            <Label>기간 설정</Label>
            <DateRangeContainer>
              <DateRange
                editableDateInputs={true}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                locale={ko} // 한국어 적용
                rangeColors={['#417DFF']} // 테마 Primary Color 적용
                dateDisplayFormat="yyyy.MM.dd"
              />
            </DateRangeContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <Label>상태</Label>
             <select 
                {...register('status')}
                style={{ 
                    height: '48px', 
                    padding: '0 16px', 
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    backgroundColor: 'white'
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

