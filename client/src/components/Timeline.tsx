
import React, { useRef, useState, useEffect } from 'react';
import type { Project } from '../types';
import { ChevronLeft, ChevronRight, LayoutList, KanbanSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TimelineProps {
    projects: Project[];
    compact?: boolean;
    onProjectUpdate?: (project: Project) => void;
    onEmptyClick?: (date: string) => void;
    onRangeSelect?: (startDate: string, endDate: string) => void;
    onProjectClick?: (project: Project) => void;
    customAction?: React.ReactNode;
}

type ViewMode = 'gantt' | 'list';
type DragMode = 'move' | 'resize-start' | 'resize-end' | null;

export const Timeline: React.FC<TimelineProps> = ({
    projects,
    compact = false,
    onProjectUpdate,
    onEmptyClick,
    onRangeSelect,
    onProjectClick,
    customAction
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('gantt');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mobile Check (Simple logic for responsiveness)
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Force list view on mobile
    useEffect(() => {
        if (isMobile) setViewMode('list');
        else if (!compact) setViewMode('gantt');
    }, [isMobile, compact]);

    // --- Date Helpers ---
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const formatYearMonth = (date: Date) => {
        return date.toLocaleString('ko-KR', { month: 'long', year: 'numeric' });
    };

    // FIX: Use local date formatting to avoid timezone shifts (UTC vs Local)
    const formatDateLocal = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // --- Interaction State for Gantt ---
    const [dragState, setDragState] = useState<{
        mode: DragMode;
        projectId: string | null;
        startX: number;
        originalStart: Date;
        originalEnd: Date;
    }>({ mode: null, projectId: null, startX: 0, originalStart: new Date(), originalEnd: new Date() });

    // --- Selection State (Drag to Create) ---
    const [selectionDraft, setSelectionDraft] = useState<{
        start: Date;
        end: Date;
        active: boolean;
        rowIndex: number; // Track which row is being dragged
    } | null>(null);

    const handleMouseDown = (e: React.MouseEvent, project: Project, mode: DragMode) => {
        if (!onProjectUpdate || isMobile) return; // Disable drag on mobile
        e.stopPropagation(); // Prevent grid selection
        setDragState({
            mode,
            projectId: project.id,
            startX: e.clientX,
            originalStart: new Date(project.startDate),
            originalEnd: new Date(project.endDate)
        });
    };

    // Handle Mouse Down on Grid Background (Start Selection)
    const handleGridMouseDown = (e: React.MouseEvent, rowIndex: number) => {
        if (isMobile || !onRangeSelect) return;

        const scrollContainer = e.currentTarget;
        const rect = scrollContainer.getBoundingClientRect();
        const scrollLeft = scrollContainer.scrollLeft;
        const scrollWidth = scrollContainer.scrollWidth;
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

        // Correct calculation accounting for scroll
        const x = e.clientX - rect.left + scrollLeft;
        const dayIndex = Math.floor((x / scrollWidth) * daysInMonth);

        // Create date object
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayIndex + 1);

        setSelectionDraft({
            start: clickedDate,
            end: clickedDate,
            active: true,
            rowIndex
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // 1. Handle Project Dragging
            if (dragState.mode && dragState.projectId && containerRef.current && onProjectUpdate) {
                const scrollContainer = containerRef.current.querySelector('.gantt-scroll-area');
                if (!scrollContainer) return;

                // Use scrollWidth for accuracy
                const totalWidth = scrollContainer.scrollWidth;
                const daysInCurrentMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                const pixelsPerDay = totalWidth / daysInCurrentMonth;

                const pixelDiff = e.clientX - dragState.startX;
                const dayDiff = Math.round(pixelDiff / pixelsPerDay);

                if (dayDiff === 0) return;

                const project = projects.find(p => p.id === dragState.projectId);
                if (!project) return;

                let newStart = new Date(dragState.originalStart);
                let newEnd = new Date(dragState.originalEnd);

                if (dragState.mode === 'move') {
                    newStart.setDate(dragState.originalStart.getDate() + dayDiff);
                    newEnd.setDate(dragState.originalEnd.getDate() + dayDiff);
                } else if (dragState.mode === 'resize-start') {
                    newStart.setDate(dragState.originalStart.getDate() + dayDiff);
                    if (newStart >= newEnd) newStart = new Date(newEnd.getTime() - 86400000);
                } else if (dragState.mode === 'resize-end') {
                    newEnd.setDate(dragState.originalEnd.getDate() + dayDiff);
                    if (newEnd <= newStart) newEnd = new Date(newStart.getTime() + 86400000);
                }

                onProjectUpdate({
                    ...project,
                    startDate: formatDateLocal(newStart),
                    endDate: formatDateLocal(newEnd)
                });
            }

            // 2. Handle Range Selection Dragging
            if (selectionDraft?.active && containerRef.current) {
                const scrollContainer = containerRef.current.querySelector('.gantt-scroll-area');
                if (!scrollContainer) return;

                const rect = scrollContainer.getBoundingClientRect();
                const scrollLeft = scrollContainer.scrollLeft;
                const scrollWidth = scrollContainer.scrollWidth;
                const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

                // Calculate current hovered day with scroll offset
                let x = e.clientX - rect.left + scrollLeft;
                // Constrain within content bounds
                x = Math.max(0, Math.min(x, scrollWidth));

                const dayIndex = Math.floor((x / scrollWidth) * daysInMonth);
                const currentHoverDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayIndex + 1);

                setSelectionDraft(prev => prev ? { ...prev, end: currentHoverDate } : null);
            }
        };

        const handleMouseUp = () => {
            // 1. End Project Drag
            if (dragState.mode) {
                setDragState({ ...dragState, mode: null, projectId: null });
            }

            // 2. End Selection Drag
            if (selectionDraft?.active) {
                if (onRangeSelect) {
                    // Determine start and end (user might drag backwards)
                    const start = selectionDraft.start < selectionDraft.end ? selectionDraft.start : selectionDraft.end;
                    const end = selectionDraft.start < selectionDraft.end ? selectionDraft.end : selectionDraft.start;

                    const startStr = formatDateLocal(start);
                    const endStr = formatDateLocal(end);

                    // Check if it was just a click (or very small drag)
                    if (startStr === endStr && onEmptyClick) {
                        onEmptyClick(startStr);
                    } else {
                        onRangeSelect(startStr, endStr);
                    }
                }
                setSelectionDraft(null);
            }
        };

        if (dragState.mode || selectionDraft?.active) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState, selectionDraft, currentDate, projects, onProjectUpdate, onRangeSelect, onEmptyClick]);

    // --- Styles ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-progress': return 'bg-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/20';
            case 'completed': return 'bg-stone-400 border-stone-500 text-white';
            default: return 'bg-stone-100 border-stone-300 text-stone-600 border-dashed';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'in-progress': return <Clock size={14} className="text-blue-600" />;
            case 'completed': return <CheckCircle2 size={14} className="text-green-600" />;
            default: return <AlertCircle size={14} className="text-stone-400" />;
        }
    };

    // --- Sub Components ---

    const Header = () => (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
                <div className="flex bg-stone-100 p-1 rounded-xl">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-xl transition-all text-stone-500 hover:text-stone-900 hover:shadow-sm"><ChevronLeft size={18} /></button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-xl transition-all text-stone-500 hover:text-stone-900 hover:shadow-sm"><ChevronRight size={18} /></button>
                </div>
                <div className="flex flex-col">
                    <span className="font-extrabold text-2xl tracking-tight text-stone-900 font-sans">{formatYearMonth(currentDate)}</span>
                </div>
            </div>

            {!isMobile && !compact && (
                <div className="flex items-center gap-2">
                    {customAction && (
                        <div className="mr-2">
                            {customAction}
                        </div>
                    )}
                    <div className="flex bg-stone-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('gantt')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'gantt' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            <KanbanSquare size={16} /> <span className="hidden lg:inline">간트차트</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            <LayoutList size={16} /> <span className="hidden lg:inline">리스트</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // 1. GANTT VIEW (Desktop Optimized)
    const GanttView = () => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        // Sort projects to ensure waterfall look (optional)
        const sortedProjects = [...projects].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        // Filter visible projects for this month to generate indices correctly
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const visibleProjects = sortedProjects.filter(project => {
            const start = new Date(project.startDate);
            const end = new Date(project.endDate);
            return !(start > monthEnd || end < monthStart);
        });

        // Helper for Selection Rendering
        const renderSelectionGhost = (rowIndex: number) => {
            if (!selectionDraft?.active || selectionDraft.rowIndex !== rowIndex) return null;

            const start = selectionDraft.start < selectionDraft.end ? selectionDraft.start : selectionDraft.end;
            const end = selectionDraft.start < selectionDraft.end ? selectionDraft.end : selectionDraft.start;

            // Ensure within current month view
            if (start > monthEnd || end < monthStart) return null;

            const visibleStart = start < monthStart ? monthStart : start;
            const visibleEnd = end > monthEnd ? monthEnd : end;

            const leftPercent = ((visibleStart.getDate() - 1) / daysInMonth) * 100;
            // +1 to include the end day fully, or at least partial width
            const widthPercent = ((visibleEnd.getDate() - visibleStart.getDate() + 1) / daysInMonth) * 100;

            return (
                <div
                    className="absolute top-0 bottom-0 bg-blue-500/20 border-l-2 border-r-2 border-blue-500 z-0 pointer-events-none transition-all duration-75"
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap">
                        새 프로젝트
                    </div>
                </div>
            );
        };

        return (
            <div ref={containerRef} className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm select-none">
                {/* Table Header */}
                <div className="flex border-b border-stone-200 bg-stone-50/50">
                    <div className="w-48 md:w-64 p-4 text-xs font-extrabold text-stone-400 uppercase tracking-wider border-r border-stone-200 flex-shrink-0">
                        프로젝트명
                    </div>
                    <div className="flex-1 overflow-hidden relative gantt-scroll-area">
                        <div className="flex h-full">
                            {days.map(d => (
                                <div key={d} className={`flex-1 h-10 border-r border-stone-100 flex items-center justify-center text-[10px] font-medium text-stone-400 ${d % 7 === 0 || d % 7 === 1 ? 'bg-stone-50' : ''}`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="max-h-[400px] overflow-y-auto">
                    {/* Empty State */}
                    {visibleProjects.length === 0 && (
                        <div
                            onClick={() => onEmptyClick && onEmptyClick(formatDateLocal(new Date()))}
                            className="p-12 text-center text-stone-400 text-sm cursor-pointer hover:bg-stone-50 transition-colors font-medium"
                        >
                            이번 달 프로젝트가 없습니다. 클릭하여 추가하세요.
                        </div>
                    )}

                    {visibleProjects.map((project, index) => {
                        const start = new Date(project.startDate);
                        const end = new Date(project.endDate);

                        // Calculate Width & Position
                        const visibleStart = start < monthStart ? monthStart : start;
                        const visibleEnd = end > monthEnd ? monthEnd : end;
                        const totalDays = daysInMonth;

                        const leftPercent = ((visibleStart.getDate() - 1) / totalDays) * 100;
                        const widthPercent = ((visibleEnd.getDate() - visibleStart.getDate() + 1) / totalDays) * 100;

                        const isDragging = dragState.projectId === project.id;

                        return (
                            <div key={project.id} className="flex border-b border-stone-100 group transition-colors relative">
                                {/* Left Column: Project Info */}
                                <div
                                    className="w-48 md:w-64 p-4 border-r border-stone-200 flex-shrink-0 flex items-center gap-3 cursor-pointer bg-white relative z-10"
                                    onClick={() => onProjectClick && onProjectClick(project)}
                                >
                                    {getStatusIcon(project.status)}
                                    <div className="truncate">
                                        <div className="text-sm font-bold text-stone-800 truncate">{project.title}</div>
                                        <div className="text-[10px] font-medium text-stone-400">{project.startDate} ~ {project.endDate}</div>
                                    </div>
                                </div>

                                {/* Right Column: Timeline Bar */}
                                <div
                                    className="flex-1 relative h-16 gantt-scroll-area cursor-crosshair"
                                    onMouseDown={(e) => handleGridMouseDown(e, index)}
                                >
                                    {/* Grid Lines (Background) */}
                                    <div className="absolute inset-0 flex pointer-events-none">
                                        {days.map(d => (
                                            <div key={d} className={`flex-1 border-r border-stone-100 h-full ${(d % 7 === 0 || d % 7 === 1) ? 'bg-stone-50/40' : ''}`}></div>
                                        ))}
                                    </div>

                                    {/* Selection Ghost - Only render if this row is being selected */}
                                    {renderSelectionGhost(index)}

                                    {/* Bar */}
                                    <div
                                        className={`absolute top-4 h-8 rounded-lg flex items-center px-3 cursor-grab active:cursor-grabbing border text-xs font-bold transition-opacity ${getStatusColor(project.status)} ${isDragging ? 'opacity-70 z-20 scale-95' : 'z-10'}`}
                                        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                        onMouseDown={(e) => handleMouseDown(e, project, 'move')}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onProjectClick) onProjectClick(project);
                                        }}
                                    >
                                        {/* Handles */}
                                        {onProjectUpdate && (
                                            <>
                                                <div className="absolute left-0 w-2 h-full cursor-w-resize hover:bg-black/10 rounded-l-lg" onMouseDown={(e) => handleMouseDown(e, project, 'resize-start')}></div>
                                                <div className="absolute right-0 w-2 h-full cursor-e-resize hover:bg-black/10 rounded-r-lg" onMouseDown={(e) => handleMouseDown(e, project, 'resize-end')}></div>
                                            </>
                                        )}
                                        <span className="truncate drop-shadow-sm pointer-events-none">{project.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Extra Empty Rows to allow creating new projects easily below existing ones */}
                    {[1, 2, 3].map((i, idx) => {
                        const rowIndex = visibleProjects.length + idx;
                        return (
                            <div key={`empty-${i}`} className="flex border-b border-stone-100 h-16 relative group">
                                <div className="w-48 md:w-64 border-r border-stone-200 bg-stone-50/20"></div>
                                <div
                                    className="flex-1 relative gantt-scroll-area cursor-crosshair"
                                    onMouseDown={(e) => handleGridMouseDown(e, rowIndex)}
                                >
                                    <div className="absolute inset-0 flex pointer-events-none">
                                        {days.map(d => (
                                            <div key={d} className={`flex-1 border-r border-stone-100 h-full ${(d % 7 === 0 || d % 7 === 1) ? 'bg-stone-50/40' : ''}`}></div>
                                        ))}
                                    </div>
                                    {renderSelectionGhost(rowIndex)}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        );
    };

    // 2. LIST VIEW (Mobile Optimized)
    const ListView = () => {
        // Filter projects for current month
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const monthProjects = projects.filter(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return (start <= monthEnd && end >= monthStart);
        }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        return (
            <div className="space-y-3">
                {/* Add Button for Mobile */}
                {onEmptyClick && (
                    <button
                        onClick={() => onEmptyClick(formatDateLocal(new Date()))}
                        className="w-full py-4 border border-dashed border-stone-300 rounded-2xl text-stone-500 text-sm font-bold hover:bg-stone-50 hover:border-stone-400 transition-colors flex items-center justify-center gap-2"
                    >
                        + {formatYearMonth(currentDate)} 프로젝트 추가
                    </button>
                )}

                {monthProjects.length === 0 && (
                    <div className="text-center py-10 text-stone-400 text-sm font-medium">
                        이 달에 진행 중인 프로젝트가 없습니다.
                    </div>
                )}

                {monthProjects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => onProjectClick && onProjectClick(project)}
                        className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                {getStatusIcon(project.status)}
                                <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">{project.status}</span>
                            </div>
                            <h3 className="font-bold text-stone-900 text-base">{project.title}</h3>
                            <p className="text-xs text-stone-500 mt-1 font-medium">
                                {project.startDate} — {project.endDate}
                            </p>
                        </div>
                        <ChevronRight size={18} className="text-stone-300" />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full select-none">
            <Header />
            {viewMode === 'gantt' ? <GanttView /> : <ListView />}
        </div>
    );
};
