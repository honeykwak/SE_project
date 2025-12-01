import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './Button';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.headings.h3.size};
  font-weight: ${({ theme }) => theme.typography.headings.h3.weight};
  color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 서버에서 주는 user 객체 구조에 따라 user.name 또는 user.username 사용
        setUserName(user.username || user.name || '사용자');
      } catch (e) {
        console.error('Failed to parse user info', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <NavContainer>
      <Logo to="/dashboard">SyncUp</Logo>
      <UserMenu>
        <Link to="/inbox" style={{ fontWeight: 500, fontSize: '14px' }}>문의함</Link>
        <UserName>{userName}님</UserName>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          로그아웃
        </Button>
      </UserMenu>
    </NavContainer>
  );
};

export default Navbar;
