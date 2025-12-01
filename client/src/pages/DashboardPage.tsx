import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import Timeline from '../components/dashboard/Timeline';
import ProjectModal from '../components/dashboard/ProjectModal';
import PortfolioModal from '../components/dashboard/PortfolioModal';
import ShareModal from '../components/dashboard/ShareModal';
import { getProjects, createProject, updateProject, deleteProject } from '../api/project';
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '../api/portfolio';
import type { Project, CreateProjectData } from '../types/project';
import type { PortfolioItem, CreatePortfolioData } from '../types/portfolio';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral.background};
`;

const Content = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.headings.h2.size};
  font-weight: ${({ theme }) => theme.typography.headings.h2.weight};
`;

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 32px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
    font-size: ${({ theme }) => theme.typography.headings.h3.size};
    margin-bottom: 8px;
`;

const ProjectList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ProjectItem = styled.li`
    padding: 16px;
    border: 1px solid ${({ theme }) => theme.colors.neutral.border};
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  // 프로젝트 및 포트폴리오 목록 불러오기
  const fetchData = async () => {
    try {
      const [projectsData, portfolioData] = await Promise.all([
        getProjects(),
        getPortfolioItems(),
      ]);
      setProjects(projectsData);
      setPortfolioItems(portfolioData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username);
      } catch (e) {
        console.error('Failed to parse user info', e);
      }
    }
  }, []);

  // --- Project Handlers ---
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSubmit = async (data: CreateProjectData) => {
    setIsLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject._id, data);
        alert('프로젝트가 수정되었습니다.');
      } else {
        await createProject(data);
        alert('새 프로젝트가 생성되었습니다.');
      }
      setIsModalOpen(false);
      fetchData(); // 목록 갱신
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteProject(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
  };

  // --- Portfolio Handlers ---
  const handleOpenCreatePortfolioModal = () => {
    setEditingPortfolio(null);
    setIsPortfolioModalOpen(true);
  };

  const handleOpenEditPortfolioModal = (item: PortfolioItem) => {
    setEditingPortfolio(item);
    setIsPortfolioModalOpen(true);
  };

  const handlePortfolioSubmit = async (data: CreatePortfolioData) => {
    setIsLoading(true);
    try {
      if (editingPortfolio) {
        await updatePortfolioItem(editingPortfolio._id, data);
        alert('포트폴리오가 수정되었습니다.');
      } else {
        await createPortfolioItem(data);
        alert('새 포트폴리오가 생성되었습니다.');
      }
      setIsPortfolioModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deletePortfolioItem(id);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    }
  };

  return (
    <Container>
      <Navbar />
      <Content>
        <Header>
          <Title>내 프로젝트 관리</Title>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="outline" onClick={() => setIsShareModalOpen(true)}>
                🔗 내 페이지 공유
            </Button>
            <Button onClick={handleOpenCreateModal}>+ 프로젝트 생성</Button>
            <Button variant="outline" onClick={handleOpenCreatePortfolioModal}>+ 포트폴리오 추가</Button>
          </div>
        </Header>

        <Section>
          <SectionTitle>이번 달 타임라인</SectionTitle>
          <Timeline projects={projects} onProjectClick={handleOpenEditModal} />
        </Section>

        <Section>
          <SectionTitle>포트폴리오 목록</SectionTitle>
          <ProjectList>
            {portfolioItems.map((item) => (
                <ProjectItem key={item._id}>
                    <div>
                        <strong>{item.title}</strong>
                        {item.description && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>{item.description}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditPortfolioModal(item)}>수정</Button>
                        <Button size="sm" variant="secondary" onClick={() => handleDeletePortfolio(item._id)}>삭제</Button>
                    </div>
                </ProjectItem>
            ))}
            {portfolioItems.length === 0 && <p style={{ color: '#888' }}>등록된 포트폴리오가 없습니다.</p>}
          </ProjectList>
        </Section>

        <Section>
          <SectionTitle>프로젝트 목록</SectionTitle>
          <ProjectList>
            {projects.map((project) => (
                <ProjectItem key={project._id}>
                    <div>
                        <strong>{project.title}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
                            {new Date(project.startDate).toLocaleDateString()} ~ {new Date(project.endDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(project)}>수정</Button>
                        <Button size="sm" variant="secondary" onClick={() => handleDeleteProject(project._id)}>삭제</Button>
                    </div>
                </ProjectItem>
            ))}
            {projects.length === 0 && <p style={{ color: '#888' }}>등록된 프로젝트가 없습니다.</p>}
          </ProjectList>
        </Section>
      </Content>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProjectSubmit}
        initialData={editingProject}
        isLoading={isLoading}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onSubmit={handlePortfolioSubmit}
        initialData={editingPortfolio}
        isLoading={isLoading}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        username={username}
      />
    </Container>
  );
};

export default DashboardPage;
