import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Timeline from '../components/dashboard/Timeline';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { getPublicPageData } from '../api/page';
import { sendInquiry } from '../api/inquiry';
import type { PublicPageData } from '../types/page';
import type { CreateInquiryData } from '../types/inquiry';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral.background};
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    gap: 20px;
  }
`;

const ProfileSection = styled.header`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  padding: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const JobTitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Intro = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: 700;
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; // 모바일에서는 1열
  }
`;

const PortfolioCard = styled.a`
  display: block;
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div<{ $src?: string }>`
  height: 160px;
  background-color: #eee;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CardTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const CardDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-size: 16px;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const PublicPage = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateInquiryData>();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      try {
        const pageData = await getPublicPageData(username);
        setData(pageData);
      } catch (err) {
        console.error(err);
        setError('페이지를 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleContactSubmit = async (formData: CreateInquiryData) => {
    if (!username) return;
    try {
      await sendInquiry(username, formData);
      alert('문의가 성공적으로 발송되었습니다.');
      reset();
    } catch (err) {
      console.error(err);
      alert('문의 발송에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>;
  if (error || !data) return <div style={{ padding: '40px', textAlign: 'center' }}>{error}</div>;

  return (
    <Container>
      <Content>
        <ProfileSection>
          <Name>{data.user.name}</Name>
          <JobTitle>{data.user.jobTitle || '프리랜서'}</JobTitle>
          <Intro>{data.user.introduction || '안녕하세요. 작업을 의뢰해주세요.'}</Intro>
        </ProfileSection>

        <Section>
          <SectionTitle>업무 일정 (Availability)</SectionTitle>
          <Timeline projects={data.projects} />
        </Section>

        <Section>
          <SectionTitle>포트폴리오 (Portfolio)</SectionTitle>
          <PortfolioGrid>
            {data.portfolio && data.portfolio.length > 0 ? (
              data.portfolio.map((item) => (
                <PortfolioCard 
                    key={item._id} 
                    href={item.projectLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                  <CardImage $src={item.imageUrl}>
                    {!item.imageUrl && 'No Image'}
                  </CardImage>
                  <CardContent>
                    <CardTitle>{item.title}</CardTitle>
                    {item.description && <CardDesc>{item.description}</CardDesc>}
                  </CardContent>
                </PortfolioCard>
              ))
            ) : (
              <p style={{ color: '#888', gridColumn: '1 / -1', textAlign: 'center' }}>
                등록된 포트폴리오가 없습니다.
              </p>
            )}
          </PortfolioGrid>
        </Section>

        <Section>
          <SectionTitle>문의하기 (Contact)</SectionTitle>
          <ContactForm onSubmit={handleSubmit(handleContactSubmit)}>
            <Input 
                label="이름" 
                placeholder="성함을 입력해주세요"
                {...register('senderName', { required: true })} 
            />
            <Input 
                label="이메일" 
                type="email"
                placeholder="답변 받을 이메일을 입력해주세요"
                {...register('senderEmail', { required: true })} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500 }}>문의 내용</label>
                <TextArea 
                    placeholder="프로젝트 의뢰 내용이나 문의사항을 적어주세요."
                    {...register('message', { required: true })} 
                />
            </div>
            <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? '전송 중...' : '문의 보내기'}
            </Button>
          </ContactForm>
        </Section>
      </Content>
    </Container>
  );
};

export default PublicPage;
