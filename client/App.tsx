
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './pages/PublicPage';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Project, UserProfile, PortfolioItem, Message } from './types';
import authService from './services/authService';

// --- RICH MOCK DATA GENERATION (KOREAN) ---

// Helper to create dates relative to today
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  // Ensure local date string YYYY-MM-DD
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const MOCK_USER: UserProfile = {
  name: "김디자인",
  role: "프로덕트 & 브랜드 디자이너",
  bio: "복잡한 문제를 우아한 사용자 경험으로 풀어냅니다. 핀테크와 SaaS 플랫폼 디자인을 전문으로 하며, 깔끔하고 타이포그래피 중심의 인터페이스를 지향합니다.",
  email: "alex@syncup.com",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
  tags: ["UI/UX", "React", "디자인 시스템", "프로토타이핑", "브랜드 전략"]
};

// Varied projects to test Gantt chart visualization
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: '핀테크 모바일 앱 리뉴얼',
    client: '뱅크코리아',
    startDate: daysFromNow(-15),
    endDate: daysFromNow(20),
    status: 'in-progress',
    description: '모바일 뱅킹 경험의 완전한 재설계 프로젝트입니다.'
  },
  {
    id: '2',
    title: '3분기 마케팅 에셋 제작',
    client: '쇼피파이',
    startDate: daysFromNow(-5),
    endDate: daysFromNow(5),
    status: 'in-progress',
    description: '소셜 미디어 및 광고 크리에이티브 제작.'
  },
  {
    id: '3',
    title: 'SaaS 대시보드 MVP',
    client: '테크플로우',
    startDate: daysFromNow(10),
    endDate: daysFromNow(45),
    status: 'planning',
    description: '관리자 대시보드 초기 디자인 및 기획.'
  },
  {
    id: '4',
    title: '디자인 시스템 감수',
    client: '앱코퍼레이션',
    startDate: daysFromNow(25),
    endDate: daysFromNow(35),
    status: 'planning',
    description: '현재 컴포넌트의 접근성 및 사용성 검토.'
  },
  {
    id: '5',
    title: '레거시 웹사이트 마이그레이션',
    client: '올드스쿨',
    startDate: daysFromNow(-40),
    endDate: daysFromNow(-10),
    status: 'completed',
    description: '워드프레스에서 Webflow로 이전 작업.'
  },
  {
    id: '6',
    title: 'UX 컨설팅 미팅',
    client: '스타트업 X',
    startDate: daysFromNow(2),
    endDate: daysFromNow(3),
    status: 'planning',
    description: '사용자 경험 컨설팅 세션.'
  },
];

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: '네오뱅크 모바일 경험',
    category: '모바일 앱',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Z세대를 위한 금융 문해력 향상과 게이미피케이션에 초점을 맞춘 뱅킹 앱 리뉴얼.'
  },
  {
    id: '2',
    title: '물류 분석 대시보드',
    category: '웹 플랫폼',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '기업 물류의 실시간 배송 추적을 위한 데이터 시각화 플랫폼.'
  },
  {
    id: '3',
    title: '여행 예약 사용자 흐름',
    category: 'UX 리서치',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '집중적인 사용자 테스트와 프로토타이핑을 통해 항공권 예약 과정의 이탈률 개선.'
  },
  {
    id: '4',
    title: '미니멀리스트 커피 브랜드',
    category: '브랜딩',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '시애틀의 고급 스페셜티 커피 로스터리를 위한 브랜드 아이덴티티 디자인.'
  },
  {
    id: '5',
    title: '스마트 홈 인터페이스',
    category: 'IoT 디자인',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-109177381792?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '통합 스마트 홈 생태계를 위한 제어 패널 디자인.'
  },
];

const MOCK_MESSAGES: Message[] = [
  { id: '1', fromName: '박지민', fromEmail: 'sarah@start.up', subject: '프로젝트 문의: 핀테크 앱', content: '안녕하세요, 네오뱅크 포트폴리오를 보고 연락드립니다. 저희도 비슷한 서비스를 준비 중인데, 다음 달부터 3개월 정도 계약이 가능하실까요?', date: '2시간 전', read: false },
  { id: '2', fromName: '이준호', fromEmail: 'mike@agency.co', subject: '프리랜서 일정 문의', content: '안녕하세요, 다음 주에 있을 피치덱 디자인을 도와주실 수 있는지 문의드립니다.', date: '1일 전', read: false },
  { id: '3', fromName: '최수진', fromEmail: 'emily@tech.io', subject: 'Re: 대시보드 디자인', content: '파일 잘 받았습니다. 개발팀에서 모바일 반응형 동작에 대해 몇 가지 질문이 있다고 합니다.', date: '3일 전', read: true },
  { id: '4', fromName: '채용팀', fromEmail: 'jobs@bigtech.com', subject: '시니어 프로덕트 디자이너 제안', content: '저희 디자인 시스템 팀을 확장하고 있는데, 귀하의 프로필이 적합해 보여 연락드립니다. 커피 챗 가능하실까요?', date: '1주 전', read: true },
];

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    // In a real app, you might also want to update backend here or in Dashboard
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Helper to ensure UserProfile match
  const validUser = user || {
    name: "Guest",
    role: "Visitor",
    bio: "",
    email: "",
    avatarUrl: "https://via.placeholder.com/150",
    tags: []
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={(u) => setUser(u)} />} />
        <Route path="/signup" element={<SignUpPage onLogin={(u) => setUser(u)} />} />

        {/* Public facing page (what clients see) */}
        <Route path="/:username" element={
          <PublicPage
            user={validUser}
            projects={[]}
            portfolio={[]}
          />
        } />

        {/* Private Dashboard (what freelancer sees) */}
        <Route path="/dashboard" element={
          user ? (
            <Dashboard
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
