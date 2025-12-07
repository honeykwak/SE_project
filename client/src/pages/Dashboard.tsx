
import React, { useState, useEffect } from 'react';
import type { UserProfile, Project, PortfolioItem, Message } from '../types';
import { Timeline } from '../components/Timeline';
import { AIAssistant } from '../components/AIAssistant';
import { generateReplyDraft } from '../services/geminiService';
import { apiService } from '../services/api';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Image,
    MessageSquare,
    Settings,
    Plus,
    X,
    Bell,
    Menu,
    QrCode,
    Copy,
    Link,
    LogOut,
    User,
    CreditCard,
    CheckCircle2,
    Trash2,
    Sparkles,
    Send,
    Loader2,
    AlertCircle,
    Upload,
    FileImage,
    ArrowLeft
} from 'lucide-react';

// Toast Component Types
type ToastType = 'success' | 'error' | 'info';
interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

export const Dashboard: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'portfolio' | 'inbox'>('overview');
    const [isAnimating, setIsAnimating] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // -- Popover States --
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // -- Share Modal State --
    const [showShareModal, setShowShareModal] = useState(false);

    // -- Profile Edit Modal State --
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editAvatar, setEditAvatar] = useState('');

    // -- Project Modal State --
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Default form state for new projects
    const [projTitle, setProjTitle] = useState('');
    const [projStart, setProjStart] = useState('');
    const [projEnd, setProjEnd] = useState('');
    const [projStatus, setProjStatus] = useState<'planning' | 'in-progress' | 'completed'>('planning');

    // -- Project Filter State --
    const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'in-progress' | 'completed'>('all');

    // -- Portfolio State --
    const [showAddPortfolio, setShowAddPortfolio] = useState(false);
    const [newPfTitle, setNewPfTitle] = useState('');
    const [newPfDesc, setNewPfDesc] = useState('');
    const [newPfImg, setNewPfImg] = useState('');

    // Upload Simulation State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // -- Inbox State --
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    // -- Toast State --
    const [toast, setToast] = useState<ToastMessage | null>(null);

    // -- DATA STATE (Connected to API) --
    const [user, setUser] = useState<UserProfile>(apiService.getUserProfile());
    const [projects, setProjects] = useState<Project[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    // Mock messages for now (Backend usually doesn't have full inbox yet)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', fromName: '박지민', fromEmail: 'sarah@start.up', subject: '프로젝트 문의: 핀테크 앱', content: '안녕하세요, 네오뱅크 포트폴리오를 보고 연락드립니다. 저희도 비슷한 서비스를 준비 중인데, 다음 달부터 3개월 정도 계약이 가능하실까요?', date: '2시간 전', read: false },
        { id: '2', fromName: '이준호', fromEmail: 'mike@agency.co', subject: '프리랜서 일정 문의', content: '안녕하세요, 다음 주에 있을 피치덱 디자인을 도와주실 수 있는지 문의드립니다.', date: '1일 전', read: false },
        { id: '3', fromName: '최수진', fromEmail: 'emily@tech.io', subject: 'Re: 대시보드 디자인', content: '파일 잘 받았습니다. 개발팀에서 모바일 반응형 동작에 대해 몇 가지 질문이 있다고 합니다.', date: '3일 전', read: true },
        { id: '4', fromName: '채용팀', fromEmail: 'jobs@bigtech.com', subject: '시니어 프로덕트 디자이너 제안', content: '저희 디자인 시스템 팀을 확장하고 있는데, 귀하의 프로필이 적합해 보여 연락드립니다. 커피 챗 가능하실까요?', date: '1주 전', read: true },
    ]);

    // --- EFFECTS ---

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedProjects = await apiService.getProjects();
                setProjects(fetchedProjects);
                const fetchedPortfolio = await apiService.getPortfolio();
                setPortfolio(fetchedPortfolio);
            } catch (e) {
                console.error("Data fetch error", e);
                showToast("데이터를 불러오는데 실패했습니다", 'error');
            }
        };
        fetchData();
    }, []);

    // Trigger animation on tab change
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 50);
        return () => clearTimeout(timer);
    }, [activeTab]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-trigger') && !target.closest('.notification-panel')) {
                setShowNotifications(false);
            }
            if (!target.closest('.settings-trigger') && !target.closest('.settings-panel')) {
                setShowSettingsMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- HANDLERS ---

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ id: Date.now(), message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleOpenProfileModal = () => {
        setEditName(user.name);
        setEditRole(user.role);
        setEditBio(user.bio);
        setEditTags(user.tags.join(', '));
        setEditAvatar(user.avatarUrl);
        setShowSettingsMenu(false);
        setShowProfileModal(true);
    };

    const handleSaveProfile = () => {
        // Note: We don't have a backend update user API yet, so we just update local state
        // In a real app, apiService.updateUser(...) would go here.
        setUser({
            ...user,
            name: editName,
            role: editRole,
            bio: editBio,
            avatarUrl: editAvatar,
            tags: editTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
        });
        setShowProfileModal(false);
        showToast('프로필이 업데이트되었습니다 (로컬)');
    };

    const openNewProjectModal = (startDate?: string, endDate?: string) => {
        setEditingProject(null);
        setProjTitle('');
        const start = startDate || new Date().toISOString().split('T')[0];
        setProjStart(start);

        if (endDate) {
            setProjEnd(endDate);
        } else {
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            setProjEnd(end.toISOString().split('T')[0]);
        }

        setProjStatus('planning');
        setShowProjectModal(true);
    };

    const handleRangeSelect = (start: string, end: string) => {
        openNewProjectModal(start, end);
    };

    const openEditProjectModal = (project: Project) => {
        setEditingProject(project);
        setProjTitle(project.title);
        setProjStart(project.startDate);
        setProjEnd(project.endDate);
        setProjStatus(project.status as any); // Cast for safe typing
        setShowProjectModal(true);
    };

    const handleSaveProject = async () => {
        try {
            if (editingProject) {
                // Update
                const updated = {
                    ...editingProject,
                    title: projTitle,
                    startDate: projStart,
                    endDate: projEnd,
                    status: projStatus
                };
                await apiService.updateProject(updated);
                setProjects(projects.map(p => p.id === editingProject.id ? updated : p));
                showToast('프로젝트가 수정되었습니다');
            } else {
                // Create
                // Pass minimal data to API Service, handle ID generation on backend
                // apiService.createProject takes Omit<Project, 'id'> and returns the created Project (from backend)
                // But currently apiService is typed to return 'any' or backend response. 
                // We'll re-fetch or optimistically add. 
                // Let's rely on re-fetching OR mapping the response.
                await apiService.createProject({
                    title: projTitle,
                    startDate: projStart,
                    endDate: projEnd,
                    status: projStatus,
                    client: 'Unknown',
                    description: ''
                });

                // Re-fetch all to ensure sync
                const all = await apiService.getProjects();
                setProjects(all);

                showToast('새 프로젝트가 생성되었습니다');
            }
            setShowProjectModal(false);
        } catch (e) {
            console.error(e);
            showToast('저장 중 오류가 발생했습니다', 'error');
        }
    };

    const handleDeleteProjectAction = async (id: string) => {
        try {
            await apiService.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
            setShowProjectModal(false);
            showToast('프로젝트가 삭제되었습니다', 'info');
        } catch (e) {
            showToast('삭제 실패', 'error');
        }
    };

    // Fake Upload Simulation
    const handleImageUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setNewPfImg(`https://picsum.photos/seed/${Date.now()}/800/600`); // Random Mock Image
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

    const handleRemoveImage = () => {
        setNewPfImg('');
        setUploadProgress(0);
    };

    const handleSavePortfolio = async () => {
        try {
            await apiService.createPortfolio({
                title: newPfTitle,
                description: newPfDesc,
                imageUrl: newPfImg || 'https://picsum.photos/400/300',
                category: 'Design'
            });

            const all = await apiService.getPortfolio();
            setPortfolio(all);

            setShowAddPortfolio(false);
            setNewPfTitle('');
            setNewPfDesc('');
            setNewPfImg('');
            setUploadProgress(0);
            showToast('포트폴리오가 추가되었습니다');
        } catch (e) {
            showToast('저장 실패', 'error');
        }
    };

    const handleDeletePortfolioAction = async (id: string) => {
        try {
            await apiService.deletePortfolio(id);
            setPortfolio(portfolio.filter(p => p.id !== id));
            showToast('포트폴리오가 삭제되었습니다', 'info');
        } catch (e) {
            showToast('삭제 실패', 'error');
        }
    };

    // Inbox Logic
    const activeMessage = messages.find(m => m.id === selectedMessageId);

    const handleMessageClick = (msg: Message) => {
        setSelectedMessageId(msg.id);
        setReplyText('');
        if (!msg.read) {
            // Mark read locally
            setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
        }
    };

    const handleGenerateReply = async (tone: 'professional' | 'friendly') => {
        if (!activeMessage) return;
        setIsGeneratingReply(true);
        const draft = await generateReplyDraft(activeMessage.content, tone);
        setReplyText(draft);
        setIsGeneratingReply(false);
        showToast('AI 답장 초안이 생성되었습니다', 'success');
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        setReplyText('');
        showToast('답장이 전송되었습니다');
    };

    const SidebarItem = ({ id, icon: Icon, label }: any) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${activeTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500 hover:bg-stone-200/50 hover:text-stone-900'}`}
        >
            <Icon size={20} className={activeTab === id ? 'stroke-[2.5px]' : ''} />
            {label}
        </button>
    );

    const getTabTitle = (tab: string) => {
        switch (tab) {
            case 'overview': return '대시보드';
            case 'projects': return '일정 관리';
            case 'portfolio': return '포트폴리오';
            case 'inbox': return '문의함';
            default: return tab;
        }
    };

    const getTabSubtitle = (tab: string) => {
        switch (tab) {
            case 'overview': return '나의 워크스페이스 현황';
            case 'projects': return '프로젝트 타임라인 및 마일스톤';
            case 'portfolio': return '등록된 작업물 관리';
            case 'inbox': return '클라이언트 커뮤니케이션';
            default: return '';
        }
    };

    // Helper to filter projects
    const getFilteredProjects = () => {
        if (filterStatus === 'all') return projects;
        return projects.filter(p => p.status === filterStatus);
    };

    // --- RENDER ---
    return (
        <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-stone-900 text-white'}`}>
                    {toast.type === 'success' && <CheckCircle2 size={18} className="text-green-400" />}
                    {toast.type === 'error' && <AlertCircle size={18} />}
                    <span className="text-sm font-bold">{toast.message}</span>
                </div>
            )}

            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="hidden md:flex w-72 bg-stone-100/50 border-r border-stone-200 flex-col justify-between p-4 flex-shrink-0 backdrop-blur-xl">
                <div>
                    <div className="px-4 py-4 mb-6">
                        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <Sparkles size={18} fill="currentColor" />
                            </div>
                            SyncUp
                        </h1>
                        <p className="text-[10px] font-bold text-stone-400 mt-1 ml-1 tracking-widest uppercase">Professional Hub</p>
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem id="overview" icon={LayoutDashboard} label="대시보드" />
                        <SidebarItem id="projects" icon={CalendarIcon} label="프로젝트 관리" />
                        <SidebarItem id="portfolio" icon={Image} label="포트폴리오" />

                        <div className="relative group">
                            <SidebarItem id="inbox" icon={MessageSquare} label="문의함" />
                            {messages.some(m => !m.read) && (
                                <span className="absolute right-4 top-3.5 w-2 h-2 bg-red-500 rounded-full ring-4 ring-stone-100"></span>
                            )}
                        </div>
                    </nav>
                </div>

                <div className="space-y-1">
                    {/* Profile Card */}
                    <div className="p-3 bg-white border border-stone-200 rounded-2xl shadow-sm mb-2 flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-colors group" onClick={handleOpenProfileModal}>
                        <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-xl object-cover border border-stone-100 group-hover:scale-105 transition-transform" />
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-extrabold text-stone-900 truncate">{user.name}</div>
                            <div className="text-[10px] font-medium text-stone-500 truncate">{user.role}</div>
                        </div>
                        <Settings size={16} className="text-stone-300 group-hover:text-stone-600 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* --- MOBILE HEADER --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 font-extrabold text-lg text-stone-900">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Sparkles size={16} fill="currentColor" />
                    </div>
                    SyncUp
                </div>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-stone-500 rounded-xl hover:bg-stone-100">
                    <Menu size={24} />
                </button>
            </div>

            {/* --- MOBILE SIDEBAR --- */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-stone-900/20 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-extrabold text-xl">메뉴</span>
                            <button onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-stone-400" /></button>
                        </div>
                        <nav className="space-y-2">
                            <SidebarItem id="overview" icon={LayoutDashboard} label="대시보드" />
                            <SidebarItem id="projects" icon={CalendarIcon} label="프로젝트 관리" />
                            <SidebarItem id="portfolio" icon={Image} label="포트폴리오" />
                            <SidebarItem id="inbox" icon={MessageSquare} label="문의함" />
                        </nav>
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-auto relative md:pt-0 pt-16 scroll-smooth">
                <div className="max-w-7xl mx-auto p-6 md:p-12 mb-20">

                    {/* Header Area */}
                    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">{getTabTitle(activeTab)}</h2>
                            <p className="text-stone-500 font-medium">{getTabSubtitle(activeTab)}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Share Button with Popover Logic could go here */}
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="px-4 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-sm font-bold shadow-sm hover:border-stone-300 hover:text-stone-900 transition-all flex items-center gap-2"
                            >
                                <QrCode size={16} /> <span className="hidden md:inline">페이지 공유</span>
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`notification-trigger p-2.5 rounded-xl border transition-all relative ${showNotifications ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-500 hover:text-stone-900'}`}
                                >
                                    <Bell size={20} />
                                    {messages.some(m => !m.read) && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>}
                                </button>

                                {/* Notification Popover */}
                                {showNotifications && (
                                    <div className="notification-panel absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-3 border-b border-stone-50 pb-2 mb-1">
                                            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">알림</div>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {messages.filter(m => !m.read).length === 0 ? (
                                                <div className="p-8 text-center text-xs text-stone-400 font-medium">새로운 알림이 없습니다.</div>
                                            ) : (
                                                messages.filter(m => !m.read).map(m => (
                                                    <div key={m.id} className="p-3 hover:bg-stone-50 rounded-xl cursor-pointer transition-colors" onClick={() => { setActiveTab('inbox'); setSelectedMessageId(m.id); setShowNotifications(false); }}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                                            <span className="text-xs font-bold text-stone-900">새 메시지</span>
                                                            <span className="text-[10px] text-stone-400 ml-auto">{m.date}</span>
                                                        </div>
                                                        <div className="text-xs text-stone-600 truncate font-medium">{m.subject}</div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Account Settings Popover */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                    className={`settings-trigger p-2.5 rounded-xl border transition-all ${showSettingsMenu ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-500 hover:text-stone-900'}`}
                                >
                                    <User size={20} />
                                </button>

                                {showSettingsMenu && (
                                    <div className="settings-panel absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <button onClick={handleOpenProfileModal} className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors text-left">
                                            <Settings size={14} /> 프로필 설정
                                        </button>
                                        <button onClick={() => showToast('로그아웃 되었습니다 (데모)', 'info')} className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                                            <LogOut size={14} /> 로그아웃
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Tab Content */}
                    <div className={`transition-all duration-500 delay-75 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

                        {/* 1. OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Welcome Card */}
                                <div className="lg:col-span-2 bg-stone-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-stone-900/20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/10 backdrop-blur-md">
                                            <Sparkles size={12} className="text-yellow-300" /> Pro Workspace
                                        </div>
                                        <h3 className="text-3xl font-extrabold mb-2 leading-tight">반가워요, {user.name}님! <br /><span className="text-stone-400">오늘도 멋진 작업을 시작해볼까요?</span></h3>
                                        <p className="text-stone-400 text-sm font-medium mb-8 max-w-md">읽지 않은 메시지가 <span className="text-white underline decoration-blue-500 font-bold">{messages.filter(m => !m.read).length}건</span> 있습니다. 진행 중인 프로젝트 {projects.filter(p => p.status === 'in-progress').length}개의 마감일을 체크하세요.</p>

                                        <div className="flex gap-3">
                                            <button onClick={() => setActiveTab('projects')} className="px-5 py-3 bg-white text-stone-900 rounded-xl text-xs font-extrabold hover:bg-blue-50 transition-colors shadow-lg shadow-white/10">일정 확인하기</button>
                                            <button onClick={() => openNewProjectModal()} className="px-5 py-3 bg-white/10 text-white rounded-xl text-xs font-extrabold hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">새 프로젝트</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats / Quick Actions */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">이번 달 수익</div>
                                                <div className="text-2xl font-extrabold text-stone-900">₩ 4,250,000</div>
                                            </div>
                                            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CreditCard size={20} /></div>
                                        </div>
                                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-green-500 w-[75%] h-full rounded-full"></div>
                                        </div>
                                        <div className="mt-2 text-[10px] font-bold text-stone-400 text-right">목표 달성 75%</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => openNewProjectModal()} className="bg-blue-50 p-4 rounded-[1.5rem] border border-blue-100 flex flex-col items-center justify-center gap-2 text-blue-600 hover:bg-blue-100 transition-colors group">
                                            <Plus size={24} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold">프로젝트 추가</span>
                                        </button>
                                        <button onClick={() => { setShowAddPortfolio(true); setActiveTab('portfolio'); }} className="bg-purple-50 p-4 rounded-[1.5rem] border border-purple-100 flex flex-col items-center justify-center gap-2 text-purple-600 hover:bg-purple-100 transition-colors group">
                                            <Upload size={24} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold">작업물 업로드</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center bg-white p-2 pl-4 rounded-xl border border-stone-200 shadow-sm w-fit">
                                    <div className="flex gap-2">
                                        {(['all', 'in-progress', 'planning', 'completed'] as const).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === status ? 'bg-stone-900 text-white shadow-md' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'}`}
                                            >
                                                {status === 'all' ? '전체' : status === 'in-progress' ? '진행중' : status === 'planning' ? '계획' : '완료'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Timeline
                                    projects={getFilteredProjects()}
                                    onEmptyClick={(date) => openNewProjectModal(date)}
                                    onRangeSelect={handleRangeSelect}
                                    onProjectClick={(p) => openEditProjectModal(p)}
                                    onProjectUpdate={async (updated) => {
                                        // Direct dragging update
                                        await apiService.updateProject(updated);
                                        setProjects(projects.map(p => p.id === updated.id ? updated : p));
                                    }}
                                    customAction={
                                        <button onClick={() => openNewProjectModal()} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-lg shadow-stone-900/20">
                                            <Plus size={16} /> 프로젝트 추가
                                        </button>
                                    }
                                />
                            </div>
                        )}

                        {/* 3. PORTFOLIO TAB */}
                        {activeTab === 'portfolio' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="text-sm font-bold text-stone-500">총 <span className="text-stone-900">{portfolio.length}</span>개의 작품</div>
                                    <button
                                        onClick={() => setShowAddPortfolio(true)}
                                        className="bg-stone-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20 active:scale-95 flex items-center gap-2"
                                    >
                                        <Plus size={18} /> 새 작품 업로드
                                    </button>
                                </div>

                                {portfolio.length === 0 ? (
                                    <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-16 text-center">
                                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                                            <Image size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-stone-900 mb-2">아직 포트폴리오가 없습니다</h3>
                                        <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">멋진 작업물을 업로드하여 클라이언트에게 당신의 실력을 보여주세요.</p>
                                        <button
                                            onClick={() => setShowAddPortfolio(true)}
                                            className="text-blue-600 font-bold text-sm hover:underline"
                                        >
                                            첫 작품 업로드하기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {portfolio.map(item => (
                                            <div key={item.id} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative">
                                                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                                        <button className="p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors" title="외부 링크">
                                                            <Link size={18} className="text-stone-900" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePortfolioAction(item.id)}
                                                            className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors" title="삭제"
                                                        >
                                                            <Trash2 size={18} className="text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-2">{item.category}</div>
                                                    <h3 className="font-bold text-stone-900 text-lg mb-2 truncate">{item.title}</h3>
                                                    <p className="text-xs text-stone-500 font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. INBOX TAB */}
                        {activeTab === 'inbox' && (
                            <div className="flex h-[calc(100vh-240px)] bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Message List */}
                                <div className={`${selectedMessageId ? 'hidden md:block' : 'block'} w-full md:w-80 lg:w-96 border-r border-stone-200 flex flex-col bg-stone-50/50`}>
                                    <div className="p-4 border-b border-stone-200 bg-white">
                                        <h3 className="font-bold text-stone-900">받은 메시지함</h3>
                                        <div className="text-xs text-stone-500 font-medium mt-1">총 {messages.length}개 / 읽지 않음 {messages.filter(m => !m.read).length}개</div>
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                onClick={() => handleMessageClick(msg)}
                                                className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-white transition-colors relative group ${selectedMessageId === msg.id ? 'bg-white shadow-[inset_3px_0_0_0_#2563eb]' : ''} ${!msg.read ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`text-sm font-bold ${!msg.read ? 'text-blue-900' : 'text-stone-900'}`}>{msg.fromName}</span>
                                                    <span className="text-[10px] text-stone-400 font-medium">{msg.date}</span>
                                                </div>
                                                <div className={`text-xs truncate mb-1 ${!msg.read ? 'font-bold text-stone-800' : 'font-medium text-stone-600'}`}>{msg.subject}</div>
                                                <div className="text-[10px] text-stone-400 line-clamp-1">{msg.content}</div>

                                                {!msg.read && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full md:group-hover:opacity-0 transition-opacity"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message Detail */}
                                <div className={`${!selectedMessageId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white h-full relative`}>
                                    {!activeMessage ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-stone-300">
                                            <MessageSquare size={48} className="mb-4 opacity-20" />
                                            <p className="text-sm font-bold opacity-50">메시지를 선택하여 내용을 확인하세요</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Detail Header */}
                                            <div className="p-6 border-b border-stone-100 flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <button onClick={() => setSelectedMessageId(null)} className="md:hidden p-1 -ml-2 mr-1 text-stone-400"><ArrowLeft size={20} /></button>
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                        {activeMessage.fromName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="text-lg font-bold text-stone-900 leading-tight">{activeMessage.subject}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-bold text-stone-600">{activeMessage.fromName}</span>
                                                            <span className="text-[10px] text-stone-400">&lt;{activeMessage.fromEmail}&gt;</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">{activeMessage.date}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-8 overflow-y-auto">
                                                <p className="text-sm text-stone-700 leading-7 whitespace-pre-line">{activeMessage.content}</p>
                                            </div>

                                            {/* AI Reply Area */}
                                            <div className="p-4 bg-stone-50 border-t border-stone-200">
                                                {!replyText ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Sparkles size={14} className="text-purple-600" />
                                                            <span className="text-xs font-bold text-purple-900">AI 답장 도우미</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleGenerateReply('professional')}
                                                                disabled={isGeneratingReply}
                                                                className="flex-1 py-3 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                                            >
                                                                {isGeneratingReply ? <Loader2 size={14} className="animate-spin" /> : '💼 정중한 비즈니스 톤'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleGenerateReply('friendly')}
                                                                disabled={isGeneratingReply}
                                                                className="flex-1 py-3 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                                            >
                                                                {isGeneratingReply ? <Loader2 size={14} className="animate-spin" /> : '☕ 친근하고 부드러운 톤'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="animate-in fade-in slide-in-from-bottom-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-bold text-stone-500">답장 초안</span>
                                                            <button onClick={() => setReplyText('')} className="text-xs text-red-500 font-bold hover:underline">취소</button>
                                                        </div>
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            className="w-full h-32 p-3 text-sm bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-3 text-stone-800"
                                                        />
                                                        <button
                                                            onClick={handleSendReply}
                                                            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                                        >
                                                            <Send size={16} /> 답장 보내기
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </main>

            {/* --- MODALS --- */}

            {/* 1. Share/QR Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-extrabold text-stone-900 mb-2">페이지 공유</h3>
                            <p className="text-stone-500 text-sm font-medium">클라이언트에게 내 프로필을 공유하세요.</p>
                        </div>

                        <div className="bg-stone-50 p-6 rounded-2xl flex items-center justify-center mb-6 border border-stone-100">
                            <QrCode size={120} className="text-stone-900" />
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl mb-6">
                            <div className="flex-1 truncate text-xs font-medium text-stone-500 px-1">
                                https://syncup.com/{user.email.split('@')[0]}
                            </div>
                            <button
                                onClick={() => showToast('링크가 복사되었습니다')}
                                className="p-2 bg-white rounded-lg shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
                            >
                                <Copy size={14} className="text-stone-700" />
                            </button>
                        </div>

                        <button onClick={() => setShowShareModal(false)} className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm hover:bg-stone-800 transition-colors">
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Project Modal (Create/Edit) */}
            {showProjectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowProjectModal(false)}>
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-stone-900">{editingProject ? '프로젝트 수정' : '새 프로젝트'}</h3>
                            <button onClick={() => setShowProjectModal(false)} className="p-1 hover:bg-stone-100 rounded-full"><X size={20} className="text-stone-400" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">프로젝트명</label>
                                <input
                                    value={projTitle}
                                    onChange={(e) => setProjTitle(e.target.value)}
                                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal"
                                    placeholder="예: 핀테크 앱 리뉴얼"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">시작일</label>
                                    <input
                                        type="date"
                                        value={projStart}
                                        onChange={(e) => setProjStart(e.target.value)}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">종료일</label>
                                    <input
                                        type="date"
                                        value={projEnd}
                                        onChange={(e) => setProjEnd(e.target.value)}
                                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">상태</label>
                                <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-200">
                                    {(['planning', 'in-progress', 'completed'] as const).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setProjStatus(s)}
                                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${projStatus === s ? 'bg-white shadow-sm text-stone-900 ring-1 ring-stone-900/5' : 'text-stone-400 hover:text-stone-600'}`}
                                        >
                                            {s === 'planning' ? '계획' : s === 'in-progress' ? '진행중' : '완료'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            {editingProject && (
                                <button
                                    onClick={() => handleDeleteProjectAction(editingProject.id)}
                                    className="px-4 py-3.5 bg-red-50 text-red-500 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
                                >
                                    삭제
                                </button>
                            )}
                            <button
                                onClick={handleSaveProject}
                                className="flex-1 py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20"
                            >
                                {editingProject ? '수정 완료' : '프로젝트 생성'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Portfolio Modal */}
            {showAddPortfolio && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowAddPortfolio(false)}>
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-stone-900">새 포트폴리오 추가</h3>
                            <button onClick={() => setShowAddPortfolio(false)} className="p-1 hover:bg-stone-100 rounded-full"><X size={20} className="text-stone-400" /></button>
                        </div>

                        <div className="space-y-4">
                            {/* Image Upload Area */}
                            <div className="relative group">
                                <div className={`w-full h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${newPfImg ? 'border-transparent' : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-stone-400'}`}>
                                    {newPfImg ? (
                                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                            <img src={newPfImg} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4" onClick={handleImageUpload}>
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 size={32} className="animate-spin text-blue-600" />
                                                    <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-blue-600">
                                                        <FileImage size={24} />
                                                    </div>
                                                    <p className="text-sm font-bold text-stone-600">이미지 업로드</p>
                                                    <p className="text-xs text-stone-400 mt-1">클릭하여 이미지를 선택하세요</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">제목</label>
                                <input
                                    value={newPfTitle}
                                    onChange={(e) => setNewPfTitle(e.target.value)}
                                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal"
                                    placeholder="프로젝트 제목 입력"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-1.5 ml-1">
                                    <label className="block text-xs font-bold text-stone-500">설명</label>
                                    {/* AI Helper for Description */}
                                </div>
                                <textarea
                                    value={newPfDesc}
                                    onChange={(e) => setNewPfDesc(e.target.value)}
                                    className="w-full p-3 bg-white border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none placeholder:font-normal"
                                    placeholder="어떤 프로젝트인가요?"
                                />
                                <AIAssistant
                                    contextTitle={newPfTitle}
                                    onAccept={setNewPfDesc}
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSavePortfolio}
                                disabled={!newPfTitle || isUploading}
                                className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                업로드 완료
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Profile Edit Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}>
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-stone-900">프로필 편집</h3>
                            <button onClick={() => setShowProfileModal(false)} className="p-1 hover:bg-stone-100 rounded-full"><X size={20} className="text-stone-400" /></button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group cursor-pointer">
                                <img src={editAvatar} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-stone-100" />
                                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={24} className="text-white" />
                                </div>
                            </div>
                            <p className="text-xs text-stone-400 font-bold mt-2">프로필 사진 변경</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">이름</label>
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">직함 (Role)</label>
                                <input value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">한 줄 소개</label>
                                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 mb-1.5 ml-1">태그 (쉼표로 구분)</label>
                                <input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="예: React, UI/UX" className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button onClick={handleSaveProfile} className="w-full py-3.5 bg-stone-900 text-white font-bold rounded-xl text-sm hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20">
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

