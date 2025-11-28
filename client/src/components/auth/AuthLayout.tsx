import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.neutral.background};
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 48px;
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.headings.h1.size};
  font-weight: ${({ theme }) => theme.typography.headings.h1.weight};
  color: ${({ theme }) => theme.colors.primary.main}; // SyncUp Blue
  text-align: center;
`;

const SubTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.headings.h2.size};
  font-weight: ${({ theme }) => theme.typography.headings.h2.weight};
  text-align: center;
`;

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <Container>
      <Card>
        <Title>SyncUp</Title>
        <SubTitle>{title}</SubTitle>
        {children}
      </Card>
    </Container>
  );
};

export default AuthLayout;

