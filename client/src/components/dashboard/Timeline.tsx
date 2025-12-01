import styled from 'styled-components';
import { useState } from 'react';
import type { Project } from '../../types/project';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MonthTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral.black};
  min-width: 120px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral.background};
    color: ${({ theme }) => theme.colors.neutral.black};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.neutral.background};
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $isActive }) => ($isActive ? 'white' : 'transparent')};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.primary.main : theme.colors.neutral.gray600)};
  box-shadow: ${({ $isActive }) => ($isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

// --- Calendar Styles ---
const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
`;

const DayHeader = styled.div`
  padding: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.neutral.gray600};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
  background-color: #fafafa;
`;

const DateCell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean }>`
  min-height: 100px;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral.border};
  background-color: ${({ $isCurrentMonth }) => ($isCurrentMonth ? 'white' : '#fcfcfc')};
  
  &:nth-child(7n) {
    border-right: none;
  }

  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DateNumber = styled.div<{ $isToday: boolean }>`
  font-size: 14px;
  font-weight: ${({ $isToday }) => ($isToday ? '700' : '400')};
  color: ${({ $isToday, theme }) => ($isToday ? theme.colors.primary.main : theme.colors.neutral.gray600)};
  margin-bottom: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${({ $isToday, theme }) => ($isToday ? theme.colors.primary.light : 'transparent')};
`;

// --- Timeline (Gantt) Styles ---
const TimelineScrollArea = styled.div`
  overflow-x: auto;
  padding: 20px;
`;

const TimelineGrid = styled.div<{ $days: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $days }) => $days}, 40px);
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral.border};
`;

const TimelineHeaderCell = styled.div<{ $isToday: boolean }>`
  text-align: center;
  font-size: 12px;
  color: ${({ $isToday, theme }) => ($isToday ? theme.colors.primary.main : theme.colors.neutral.gray600)};
  font-weight: ${({ $isToday }) => ($isToday ? 'bold' : 'normal')};
  padding-bottom: 8px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100vh; // 그리드 라인 효과
    background-color: ${({ theme }) => theme.colors.neutral.border};
    opacity: 0.3;
    z-index: 0;
  }
`;

const TimelineRow = styled.div<{ $days: number }>`
  position: relative;
  height: 44px;
  margin-bottom: 8px;
  width: ${({ $days }) => $days * 40}px;
`;

// --- Common Project Chip ---
const ProjectChip = styled.div<{ $status: string; $viewMode: 'calendar' | 'timeline'; $width?: number; $offset?: number }>`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme, $status }) =>
    $status === 'completed'
      ? theme.colors.status.success + '20'
      : $status === 'planning'
      ? theme.colors.neutral.gray600 + '20'
      : theme.colors.primary.light};
  color: ${({ theme, $status }) =>
    $status === 'completed'
      ? theme.colors.status.success
      : $status === 'planning'
      ? theme.colors.neutral.gray600
      : theme.colors.primary.main};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  font-weight: 500;
  z-index: 1;

  /* Timeline View Specific Styles */
  ${({ $viewMode, $width, $offset }) =>
    $viewMode === 'timeline' &&
    `
    position: absolute;
    top: 4px;
    height: 28px;
    display: flex;
    align-items: center;
    left: ${($offset || 0) * 40}px;
    width: ${($width || 0) * 40}px;
  `}

  &:hover {
    opacity: 0.8;
    filter: brightness(0.95);
  }
`;

interface TimelineProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

const Timeline = ({ projects, onProjectClick }: TimelineProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // --- Helper Functions ---
  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const checkProjectOnDate = (project: Project, date: Date) => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    return target >= s && target <= e;
  };

  // --- Data for Calendar ---
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevDays = Array.from({ length: startDay }, (_, i) => ({
    day: prevMonthLastDay - startDay + i + 1,
    isCurrentMonth: false,
    dateObj: new Date(year, month - 1, prevMonthLastDay - startDay + i + 1)
  }));

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    dateObj: new Date(year, month, i + 1)
  }));

  const remainingDays = 42 - (prevDays.length + currentDays.length);
  const nextDays = Array.from({ length: remainingDays }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    dateObj: new Date(year, month + 1, i + 1)
  }));

  const allCalendarDays = [...prevDays, ...currentDays, ...nextDays];

  // --- Data for Timeline ---
  const timelineDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      day: i + 1,
      dateObj: d,
      isToday: isSameDate(d, new Date())
    };
  });

  const getTimelinePosition = (project: Project) => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    // 이번 달 기준 start/end day (1-based -> 0-based index로 변환을 위해 -1)
    let startIndex = start.getDate() - 1;
    // 이전 달부터 시작하면 0부터
    if (start < firstDayOfMonth) startIndex = 0;
    // 다음 달에 시작하면 표시 안 함 (필터링 됨)
    
    let endIndex = end.getDate(); // duration 계산용 (endIndex는 포함되지 않는 다음 칸)
    // 다음 달로 넘어가면 마지막 날까지
    if (end > lastDayOfMonth) endIndex = daysInMonth;

    const duration = Math.max(0, endIndex - startIndex);
    return { offset: startIndex, width: duration };
  };

  // 이번 달에 걸쳐있는 프로젝트만 필터링 (타임라인용)
  const currentMonthProjects = projects.filter(p => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    return start <= lastDayOfMonth && end >= firstDayOfMonth;
  });

  return (
    <Container>
      <Header>
        <TitleGroup>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <MonthTitle>{year}년 {month + 1}월</MonthTitle>
            <NavButton onClick={goToday} style={{ fontSize: '12px', padding: '4px 8px' }}>
              오늘
            </NavButton>
          </div>
          <ButtonGroup>
            <NavButton onClick={prevMonth}>&lt;</NavButton>
            <NavButton onClick={nextMonth}>&gt;</NavButton>
          </ButtonGroup>
        </TitleGroup>

        <ToggleContainer>
          <ToggleButton 
            $isActive={viewMode === 'calendar'} 
            onClick={() => setViewMode('calendar')}
          >
            달력
          </ToggleButton>
          <ToggleButton 
            $isActive={viewMode === 'timeline'} 
            onClick={() => setViewMode('timeline')}
          >
            타임라인
          </ToggleButton>
        </ToggleContainer>
      </Header>

      {viewMode === 'calendar' ? (
        <CalendarGrid>
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <DayHeader key={d}>{d}</DayHeader>
          ))}
          {allCalendarDays.map((item, index) => {
            const isToday = isSameDate(item.dateObj, new Date());
            const dayProjects = projects.filter(p => checkProjectOnDate(p, item.dateObj));

            return (
              <DateCell 
                key={index} 
                $isCurrentMonth={item.isCurrentMonth} 
                $isToday={isToday}
              >
                <DateNumber $isToday={isToday}>{item.day}</DateNumber>
                {dayProjects.map(project => (
                  <ProjectChip 
                    key={project._id} 
                    $status={project.status}
                    $viewMode="calendar"
                    onClick={() => onProjectClick?.(project)}
                    title={`${project.title} (${new Date(project.startDate).toLocaleDateString()} ~ ${new Date(project.endDate).toLocaleDateString()})`}
                  >
                    {project.title}
                  </ProjectChip>
                ))}
              </DateCell>
            );
          })}
        </CalendarGrid>
      ) : (
        <TimelineScrollArea>
            <TimelineGrid $days={daysInMonth}>
              {timelineDays.map((item) => (
                <TimelineHeaderCell key={item.day} $isToday={item.isToday}>
                  {item.day}
                </TimelineHeaderCell>
              ))}
            </TimelineGrid>
            
            <div style={{ position: 'relative', minHeight: '200px', marginTop: '8px' }}>
              {currentMonthProjects.length === 0 ? (
                 <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    이번 달 일정이 없습니다.
                 </div>
              ) : (
                currentMonthProjects.map((project) => {
                  const { offset, width } = getTimelinePosition(project);
                  return (
                    <TimelineRow key={project._id} $days={daysInMonth}>
                      <ProjectChip
                        $status={project.status}
                        $viewMode="timeline"
                        $offset={offset}
                        $width={width}
                        onClick={() => onProjectClick?.(project)}
                        title={`${project.title} (${new Date(project.startDate).toLocaleDateString()} ~ ${new Date(project.endDate).toLocaleDateString()})`}
                      >
                        {project.title}
                      </ProjectChip>
                    </TimelineRow>
                  );
                })
              )}
            </div>
        </TimelineScrollArea>
      )}
    </Container>
  );
};

export default Timeline;
