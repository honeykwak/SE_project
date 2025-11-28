import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { getInquiries, markInquiryAsRead } from '../api/inquiry';
import type { Inquiry } from '../types/inquiry';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral.background};
`;

const Content = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const InquiryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InquiryCard = styled.div<{ $isRead: boolean }>`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${({ theme, $isRead }) => ($isRead ? theme.colors.neutral.border : theme.colors.primary.main)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.gray600};
`;

const Sender = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.neutral.black};
`;

const Message = styled.p`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const DateText = styled.span``;

const InboxPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markInquiryAsRead(id);
      // 목록 상태 업데이트 (다시 불러오지 않고 로컬 업데이트)
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Title>받은 문의함</Title>
        {loading ? (
          <p>로딩 중...</p>
        ) : inquiries.length === 0 ? (
          <p>도착한 문의가 없습니다.</p>
        ) : (
          <InquiryList>
            {inquiries.map((item) => (
              <InquiryCard 
                key={item._id} 
                $isRead={item.isRead}
                onClick={() => handleRead(item._id, item.isRead)}
              >
                <CardHeader>
                  <Sender>{item.senderName} ({item.senderEmail})</Sender>
                  <DateText>{new Date(item.createdAt).toLocaleDateString()}</DateText>
                </CardHeader>
                <Message>{item.message}</Message>
                {!item.isRead && (
                    <span style={{ fontSize: '12px', color: '#417DFF', marginTop: '8px', display: 'block' }}>
                        • 읽지 않음 (클릭하여 읽음 처리)
                    </span>
                )}
              </InquiryCard>
            ))}
          </InquiryList>
        )}
      </Content>
    </Container>
  );
};

export default InboxPage;

