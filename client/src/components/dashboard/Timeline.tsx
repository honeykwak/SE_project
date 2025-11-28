import styled from 'styled-components';
import type { Project } from '../../types/project';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
`;

const MonthHeader = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
  padding-bottom: 8px;
`;

const DayCell = styled.div`
  min-width: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  font-size: 12px;
`;

const ProjectRow = styled.div`
  position: relative;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.neutral.background};
  border-radius: 4px;
`;

const ProjectBar = styled.div<{ $start: number; $duration: number; $status: string }>`
  position: absolute;
  top: 8px;
  height: 24px;
  left: ${({ $start }) => $start * 40}px; // 1일 = 40px 너비
  width: ${({ $duration }) => $duration * 40}px;
  background-color: ${({ theme, $status }) =>
    $status === 'completed'
      ? theme.colors.status.success
      : $status === 'planning'
      ? theme.colors.neutral.gray600
      : theme.colors.primary.main};
  border-radius: 12px;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

interface TimelineProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

const Timeline = ({ projects, onProjectClick }: TimelineProps) => {
  // 현재 날짜 기준으로 이번 달의 1일~말일 표시 (간단한 버전)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 이번 달 범위 내에서 시작/끝 계산
    // (더 정교한 로직은 날짜 라이브러리(date-fns) 등을 쓰면 좋음)
    let startDay = start.getDate() - 1;
    if (start.getMonth() < month || start.getFullYear() < year) startDay = 0;
    if (start.getMonth() > month || start.getFullYear() > year) startDay = daysInMonth;

    let endDay = end.getDate();
    if (end.getMonth() < month || end.getFullYear() < year) endDay = 0;
    if (end.getMonth() > month || end.getFullYear() > year) endDay = daysInMonth;

    // 이번 달에 포함되지 않는 프로젝트는 렌더링 제외 (상위에서 필터링하거나 여기서 처리)
    // 여기서는 간단히 duration 계산
    const duration = Math.max(0, endDay - startDay);
    
    return { start: startDay, duration };
  };

  return (
    <TimelineContainer>
      <MonthHeader>
        {days.map((day) => (
          <DayCell key={day}>{day}</DayCell>
        ))}
      </MonthHeader>
      
      {/* 프로젝트가 없으면 안내 메시지 */}
      {projects.length === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
          등록된 프로젝트가 없습니다.
        </div>
      )}

      {projects.map((project) => {
        const { start, duration } = getPosition(project.startDate, project.endDate);
        if (duration <= 0) return null; // 이번 달에 표시될 게 없음

        return (
          <ProjectRow key={project._id}>
            <ProjectBar
              $start={start}
              $duration={duration}
              $status={project.status}
              onClick={() => onProjectClick?.(project)}
            >
              {project.title}
            </ProjectBar>
          </ProjectRow>
        );
      })}
    </TimelineContainer>
  );
};

export default Timeline;

