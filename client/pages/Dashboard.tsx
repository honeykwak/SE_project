
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Project, PortfolioItem, Message } from '../types';
import { Timeline } from '../components/Timeline';
import { AIAssistant } from '../components/AIAssistant';
import { generateReplyDraft } from '../services/geminiService';
import dataService from '../services/dataService';
import authService from '../services/authService';
import { useToast } from '../context/ToastContext';
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
    UploadCloud,
    LogOut,
    User,
    CreditCard,
    Check,
    Trash2,
    Sparkles,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Upload,
    FileImage,
    Eye,
    RefreshCw
} from 'lucide-react';

interface DashboardProps {
    user: UserProfile;
    onUpdateUser: (u: UserProfile) => void;
}



export const Dashboard: React.FC<DashboardProps> = ({
    user,
    onUpdateUser
}) => {
    // Local Data State
    const [projects, setProjects] = useState<Project[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projData, portData, msgData] = await Promise.all([
                    dataService.getProjects(),
                    dataService.getPortfolio(),
                    dataService.getInquiries()
                ]);
                setProjects(projData.map((p: any) => ({ ...p, id: p._id || p.id })));
                setPortfolio(portData.map((p: any) => ({ ...p, id: p._id || p.id })));
                // Inquiries are now mapped in dataService
                setMessages(msgData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                showToast('데이터를 불러오는데 실패했습니다', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Real-time Polling for Inquiries (every 15 seconds)
        const intervalId = setInterval(async () => {
            try {
                const newMessages = await dataService.getInquiries();
                setMessages(prev => {
                    // Only update if length changed or unread count changed to avoid flickering
                    // Simple check: compare JSON string or just update
                    // For now, always update to ensure read status sync
                    return newMessages;
                });
            } catch (error) {
                console.error("Polling failed");
            }
        }, 15000);

        return () => clearInterval(intervalId);
    }, []);
    const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'portfolio' | 'inbox'>('overview');
    // Animation State
    const [isAnimating, setIsAnimating] = useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // -- Popover States --
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // -- Share Modal State --
    const [showShareModal, setShowShareModal] = useState(false);
    useEffect(() => {
        if (showShareModal) setIsQrLoading(true);
    }, [showShareModal]);

    // -- Profile Edit Modal State --
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editRole, setEditRole] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editTags, setEditTags] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [editAvailability, setEditAvailability] = useState('');

    // -- Project Modal State --
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Default form state for new projects
    const [projTitle, setProjTitle] = useState('');
    const [projStart, setProjStart] = useState('');
    const [projEnd, setProjEnd] = useState('');
    const [projStatus, setProjStatus] = useState<'planning' | 'in-progress' | 'completed'>('planning');

    // QR Loading State
    const [isQrLoading, setIsQrLoading] = useState(true);

    // -- Project Filter State --
    const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'in-progress' | 'completed'>('all');

    // -- Portfolio State --
    const [showAddPortfolio, setShowAddPortfolio] = useState(false);
    const [newPfTitle, setNewPfTitle] = useState('');
    const [newPfDesc, setNewPfDesc] = useState('');
    const [newPfImg, setNewPfImg] = useState('');



    // -- Inbox State --
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isGeneratingReply, setIsGeneratingReply] = useState(false);

    // -- Toast State --
    const { success, error, info } = useToast();

    // Alias for compatibility during refactor
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        if (type === 'error') error(message);
        else if (type === 'info') info(message);
        else success(message);
    };

    // Trigger animation on tab change
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 50); // Small delay to trigger transition
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

    // Open profile modal when user clicks "My Account"
    const handleOpenProfileModal = () => {
        setEditName(user.name);
        setEditRole(user.role);
        setEditBio(user.bio);
        setEditTags(user.tags.join(', '));
        setEditAvatar(user.avatarUrl);
        setEditLocation(user.location || '');
        setEditAvailability(user.availability || '');
        setShowSettingsMenu(false);
        setShowProfileModal(true);
    };

    const handleSaveProfile = async () => {
        try {
            const updatedData = {
                name: editName,
                role: editRole,
                bio: editBio,
                avatarUrl: editAvatar,
                tags: editTags.split(',').map(t => t.trim()).filter(t => t.length > 0),
                location: editLocation,
                availability: editAvailability
            };

            const updatedUser = await authService.updateProfile(updatedData);
            onUpdateUser(updatedUser);
            setShowProfileModal(false);
            showToast('프로필이 업데이트되었습니다 (저장됨)');
        } catch (error) {
            console.error(error);
            showToast('프로필 업데이트 실패');
        }
    };

    // --- Handlers ---

    const handleUpdateProject = async (project: Project) => {
        try {
            const updated = await dataService.updateProject(project.id, project);
            setProjects(projects.map(p => p.id === updated.id ? updated : p));
            showToast('프로젝트가 업데이트되었습니다');
        } catch (error) {
            showToast('업데이트 실패', 'error');
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await dataService.markAsRead(id);
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };



    const openNewProjectModal = (startDate?: string, endDate?: string) => {
        setEditingProject(null);
        setProjTitle('');
        const start = startDate || new Date().toISOString().split('T')[0];
        setProjStart(start);

        // Default 1 month duration if no end date provided
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

    // Handler for Drag-to-Create
    const handleRangeSelect = (start: string, end: string) => {
        openNewProjectModal(start, end);
    };

    const openEditProjectModal = (project: Project) => {
        setEditingProject(project);
        setProjTitle(project.title);
        setProjStart(project.startDate ? project.startDate.split('T')[0] : '');
        setProjEnd(project.endDate ? project.endDate.split('T')[0] : '');
        setProjStatus(project.status);
        setShowProjectModal(true);
    };

    const handleSaveProject = async () => {
        try {
            if (editingProject) {
                // Update
                const updated = await dataService.updateProject(editingProject.id, {
                    ...editingProject,
                    title: projTitle,
                    startDate: projStart,
                    endDate: projEnd,
                    status: projStatus
                });
                setProjects(projects.map(p => p.id === updated.id ? updated : p));
                showToast('프로젝트가 수정되었습니다');
            } else {
                // Create
                const newProj = await dataService.createProject({
                    id: '', // Backend generates ID
                    title: projTitle,
                    client: 'Unknown',
                    startDate: projStart,
                    endDate: projEnd,
                    status: projStatus,
                    description: ''
                });
                setProjects([...projects, newProj]);
                showToast('새 프로젝트가 생성되었습니다');
            }
            setShowProjectModal(false);
        } catch (error) {
            showToast('프로젝트 저장 실패', 'error');
        }
    };

    const handleDeleteProjectAction = async (id: string) => {
        try {
            await dataService.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
            setShowProjectModal(false);
            showToast('프로젝트가 삭제되었습니다', 'info');
        } catch (error) {
            showToast('삭제 실패', 'error');
        }
    };



    const handleSavePortfolio = async () => {
        try {
            const newItem = await dataService.createPortfolio({
                id: '', // Generated by backend
                title: newPfTitle,
                description: newPfDesc,
                imageUrl: newPfImg || 'https://picsum.photos/400/300',
                category: 'Design'
            });
            setPortfolio([...portfolio, newItem]);

            setShowAddPortfolio(false);
            setNewPfTitle('');
            setNewPfDesc('');
            setNewPfImg('');
            showToast('포트폴리오가 추가되었습니다');
        } catch (error) {
            showToast('저장 실패', 'error');
        }
    };

    const handleDeletePortfolioAction = async (id: string) => {
        try {
            await dataService.deletePortfolio(id);
            setPortfolio(portfolio.filter(p => p.id !== id));
            showToast('포트폴리오가 삭제되었습니다', 'info');
        } catch (error) {
            showToast('삭제 실패', 'error');
        }
    };

    // Inbox Logic
    const activeMessage = messages.find(m => m.id === selectedMessageId);

    const handleMessageClick = async (msg: Message) => {
        setSelectedMessageId(msg.id);
        setReplyText('');
        if (!msg.read) {
            try {
                await dataService.markAsRead(msg.id);
                setMessages(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
            } catch (error) {
                console.error("Failed to mark as read");
            }
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

    const handleSendReply = async () => {
        if (!replyText.trim() || !activeMessage) return;

        const contentToSend = replyText;
        setReplyText(''); // Optimistic UI clear

        try {
            showToast('답장을 전송 중입니다...', 'info');
            await dataService.replyInquiry(activeMessage.id, contentToSend);
            showToast('답장이 성공적으로 전송되었습니다', 'success');
        } catch (error) {
            setReplyText(contentToSend); // Restore text on failure
            console.error('Failed to send reply:', error);
            showToast('답장 전송에 실패했습니다', 'error');
        }
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

    return (
        <div className="flex h-screen bg-stone-50 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900 relative">

            {/* GLOBAL TOAST IS HANDLED BY PROVIDER NOW */}

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-stone-900/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar Navigation */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-stone-50 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl md:shadow-none bg-white md:bg-stone-50' : '-translate-x-full'}
      `}>
                {/* Header - Fixed Height for alignment */}
                <div className="h-28 flex items-center px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 transform -rotate-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            </svg>
                        </div>
                        <div className="font-extrabold text-2xl tracking-tight text-stone-900">SyncUp.</div>
                    </div>
                    <button className="md:hidden ml-auto text-stone-400 p-2" onClick={() => setMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-6 space-y-2 py-4">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider px-4 mb-2">메뉴</div>
                    <SidebarItem id="overview" icon={LayoutDashboard} label="대시보드" />
                    <SidebarItem id="projects" icon={CalendarIcon} label="일정 관리" />
                    <SidebarItem id="portfolio" icon={Image} label="포트폴리오" />
                    <SidebarItem id="inbox" icon={MessageSquare} label="문의함" />

                    {/* Added Share Page button to Sidebar */}
                    <div className="pt-4 mt-2 border-t border-stone-100/50">
                        <button
                            onClick={() => {
                                setShowShareModal(true);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-200 group"
                        >
                            <Link size={20} className="group-hover:stroke-white" />
                            페이지 공유
                        </button>
                    </div>
                </nav>

                {/* User Profile in Sidebar with Settings Popover */}
                <div className="p-6 relative">
                    {/* Settings Popover */}
                    {showSettingsMenu && (
                        <div className="settings-panel absolute bottom-full left-6 right-6 mb-2 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                            <button
                                onClick={handleOpenProfileModal}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 rounded-xl text-stone-600 text-sm font-bold transition-colors"
                            >
                                <User size={16} /> 내 계정
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50 rounded-xl text-stone-600 text-sm font-bold transition-colors">
                                <CreditCard size={16} /> 결제 관리
                            </button>
                            <div className="h-px bg-stone-100 my-1"></div>
                            <button
                                onClick={() => window.location.hash = '/login'}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-red-500 rounded-xl text-sm font-bold transition-colors"
                            >
                                <LogOut size={16} /> 로그아웃
                            </button>
                        </div>
                    )}

                    <div
                        onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                        className="settings-trigger bg-white p-4 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow active:scale-95"
                    >
                        <img src={user.avatarUrl} className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100" alt="Profile" />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-stone-900 text-sm truncate">{user.name}</div>
                            <div className="text-stone-400 text-xs truncate">Free Plan</div>
                        </div>
                        <button className="text-stone-400 hover:text-stone-600 p-2 hover:bg-stone-50 rounded-full transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Floating Card Layout */}
            <main className="flex-1 h-full p-2 md:p-4 md:pl-0 overflow-hidden">
                <div className="bg-white w-full h-full rounded-[2.5rem] shadow-sm border border-stone-200 flex flex-col overflow-hidden relative">

                    {/* Header inside the card - Matches Sidebar Header Height */}
                    <header className="h-28 px-6 md:px-12 flex justify-between items-center flex-shrink-0 bg-white z-30 sticky top-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 -ml-2 text-stone-500 hover:bg-stone-50 rounded-xl"
                            >
                                <Menu size={24} />
                            </button>
                            {/* Space Diet: Horizontal Alignment */}
                            <div className={`flex items-baseline gap-4 transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                <h1 className="text-3xl font-extrabold text-stone-900 capitalize tracking-tight">{getTabTitle(activeTab)}</h1>
                                <div className="hidden md:block w-px h-6 bg-stone-200 self-center"></div>
                                <p className="text-stone-400 text-sm font-medium hidden md:block">{getTabSubtitle(activeTab)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 relative">
                            {/* Notification Button */}
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`notification-trigger p-3 rounded-full relative transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-stone-400 hover:bg-stone-50'}`}
                            >
                                <Bell size={20} />
                                {(messages.filter(m => !m.read).length > 0) && (
                                    <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>

                            {/* Notification Popover */}
                            {showNotifications && (
                                <div className="notification-panel absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-white/50">
                                        <h4 className="font-bold text-sm text-stone-900">알림</h4>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {messages.filter(m => !m.read).length === 0 ? (
                                            <div className="p-8 text-center text-stone-400 text-xs font-medium">
                                                새로운 알림이 없습니다.
                                            </div>
                                        ) : (
                                            messages.filter(m => !m.read).map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    onClick={() => {
                                                        setActiveTab('inbox');
                                                        setSelectedMessageId(msg.id);
                                                        handleMarkAsRead(msg.id);
                                                        setShowNotifications(false);
                                                    }}
                                                    className="p-4 hover:bg-blue-50/50 transition-colors border-b border-stone-50 cursor-pointer group"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                        <div>
                                                            <p className="text-xs text-stone-800 font-bold mb-1 group-hover:text-blue-700">새로운 문의 도착</p>
                                                            <p className="text-xs text-stone-500 leading-relaxed truncate max-w-[180px]">{msg.subject}</p>
                                                            <p className="text-[10px] text-stone-400 mt-2 font-medium">{msg.date}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 scroll-smooth">
                        <div className={`max-w-7xl mx-auto space-y-8 transition-all duration-500 ease-out transform ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>

                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div key="overview" className="space-y-8">
                                    {/* Stats - Space Diet: Horizontal Layout */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-5 rounded-3xl border border-stone-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group flex items-center gap-5">
                                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                                <LayoutDashboard size={24} />
                                            </div>
                                            <div>
                                                <div className="text-stone-400 text-xs font-bold uppercase mb-0.5 tracking-wider">총 방문수</div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-3xl font-extrabold text-stone-900">{(user.visits || 0).toLocaleString()}</span>
                                                    <span className="text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full">+Real</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-5 rounded-3xl border border-stone-100 hover:border-purple-100 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 group flex items-center gap-5">
                                            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                                                <CalendarIcon size={24} />
                                            </div>
                                            <div>
                                                <div className="text-stone-400 text-xs font-bold uppercase mb-0.5 tracking-wider">진행 중</div>
                                                <div className="text-3xl font-extrabold text-stone-900">{projects.filter(p => p.status === 'in-progress').length}</div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-5 rounded-3xl border border-stone-100 hover:border-orange-100 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group flex items-center gap-5">
                                            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <div className="text-stone-400 text-xs font-bold uppercase mb-0.5 tracking-wider">신규 문의</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-3xl font-extrabold text-stone-900">{messages.filter(m => !m.read).length}</div>
                                                    {messages.filter(m => !m.read).length > 0 && (
                                                        <span className="text-orange-600 text-[10px] font-bold bg-orange-50 px-2 py-0.5 rounded-full">New</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Snippet */}
                                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100 shadow-sm">
                                        <Timeline
                                            projects={projects}
                                            compact
                                            onProjectUpdate={handleUpdateProject}
                                            onEmptyClick={(d) => openNewProjectModal(d)}
                                            onRangeSelect={handleRangeSelect}
                                            onProjectClick={openEditProjectModal}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* PROJECTS TAB (Detailed Management) */}
                            {activeTab === 'projects' && (
                                <div key="projects" className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100 shadow-sm min-h-[600px]">

                                    {/* Filter Tabs with Integrated Legend */}
                                    <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-stone-100">
                                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2">상태 필터:</span>
                                        {[
                                            { id: 'all', label: '전체', dotClass: 'hidden' },
                                            { id: 'in-progress', label: '진행 중', dotClass: 'bg-blue-600' },
                                            { id: 'planning', label: '계획 중', dotClass: 'bg-stone-100 border border-stone-300 border-dashed' },
                                            { id: 'completed', label: '완료됨', dotClass: 'bg-green-600' }
                                        ].map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setFilterStatus(filter.id as any)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${filterStatus === filter.id
                                                    ? 'bg-stone-900 text-white shadow-lg shadow-stone-900/20'
                                                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                                                    }`}
                                            >
                                                {filter.id !== 'all' && (
                                                    <div className={`w-2 h-2 rounded-full ${filter.dotClass}`}></div>
                                                )}
                                                {filter.label}
                                            </button>
                                        ))}
                                    </div>

                                    <Timeline
                                        projects={getFilteredProjects()}
                                        onProjectUpdate={handleUpdateProject}
                                        onEmptyClick={(d) => openNewProjectModal(d)}
                                        onRangeSelect={handleRangeSelect}
                                        onProjectClick={openEditProjectModal}
                                        customAction={
                                            <button
                                                onClick={() => openNewProjectModal()}
                                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all whitespace-nowrap"
                                            >
                                                <Plus size={16} /> 프로젝트
                                            </button>
                                        }
                                    />
                                </div>
                            )}

                            {/* PORTFOLIO TAB */}
                            {activeTab === 'portfolio' && (
                                <div key="portfolio">
                                    {/* Space Diet: Single line header control */}
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => setShowAddPortfolio(true)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                        >
                                            <Plus size={18} /> 아이템 추가
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {portfolio.map(item => (
                                            <div key={item.id} className="bg-white border border-stone-100 rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 relative">
                                                <div className="h-56 bg-stone-100 relative overflow-hidden">
                                                    <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                                                    {/* HOVER OVERLAY ACTION */}
                                                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                        <button className="bg-white text-stone-900 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-blue-50 transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2">
                                                            수정
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePortfolioAction(item.id)}
                                                            className="bg-red-500 text-white px-3 py-2.5 rounded-full hover:bg-red-600 transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="text-xs font-extrabold text-blue-600 uppercase tracking-wide mb-2">{item.category}</div>
                                                    <h4 className="font-bold text-xl text-stone-900 truncate mb-2">{item.title}</h4>
                                                    <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* INBOX TAB (Intelligent Inbox) */}
                            {activeTab === 'inbox' && (
                                <div key="inbox" className="bg-white border border-stone-100 rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-[700px] shadow-sm">
                                    {/* List Sidebar - Space Diet: Compact List Items */}
                                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-stone-100 overflow-y-auto bg-stone-50/30">
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                onClick={() => handleMessageClick(msg)}
                                                className={`p-5 border-b border-stone-100 cursor-pointer hover:bg-white transition-all group relative ${selectedMessageId === msg.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : !msg.read ? 'bg-blue-50/40' : ''}`}
                                            >
                                                {!msg.read && selectedMessageId !== msg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`text-sm font-bold truncate pr-2 ${!msg.read ? 'text-blue-900' : 'text-stone-900'}`}>{msg.fromName}</span>
                                                    <span className="text-[10px] text-stone-400 whitespace-nowrap">{msg.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-stone-700 truncate max-w-[40%]">{msg.subject}</span>
                                                    <span className="text-xs text-stone-400 truncate flex-1">- {msg.content}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Detail View */}
                                    <div className="w-full md:w-2/3 flex flex-col h-full bg-white relative">
                                        {activeMessage ? (
                                            <div className="flex flex-col h-full">
                                                {/* Message Header */}
                                                <div className="p-8 border-b border-stone-100 flex-shrink-0">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h2 className="text-2xl font-bold text-stone-900 mb-2">{activeMessage.subject}</h2>
                                                            <div className="flex items-center gap-2 text-sm text-stone-500">
                                                                <span className="font-bold text-stone-900">{activeMessage.fromName}</span>
                                                                <span>&lt;{activeMessage.fromEmail}&gt;</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{activeMessage.date}</span>
                                                    </div>
                                                    <div className="bg-stone-50 p-6 rounded-2xl text-stone-700 text-sm leading-relaxed border border-stone-100">
                                                        {activeMessage.content}
                                                    </div>
                                                </div>

                                                {/* AI Reply Area */}
                                                <div className="flex-1 p-8 bg-stone-50/30 flex flex-col overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles size={16} className="text-blue-600" />
                                                            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">AI 답장 어시스턴트</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleGenerateReply('professional')}
                                                                disabled={isGeneratingReply}
                                                                className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
                                                            >
                                                                ✨ 프로젝트 수락
                                                            </button>
                                                            <button
                                                                onClick={() => handleGenerateReply('friendly')}
                                                                disabled={isGeneratingReply}
                                                                className="text-xs font-bold px-3 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50"
                                                            >
                                                                ✋ 정중한 거절
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="relative flex-1">
                                                        {isGeneratingReply && (
                                                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                                                                <Loader2 className="animate-spin text-blue-600" size={32} />
                                                            </div>
                                                        )}
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            className="w-full h-full p-4 border border-stone-200 rounded-2xl text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                                                            placeholder="직접 답장을 작성하거나 위의 AI 버튼을 사용해보세요..."
                                                        />
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <button
                                                            onClick={handleSendReply}
                                                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                                                        >
                                                            답장 보내기 <Send size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col justify-center items-center text-stone-300 h-full">
                                                <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                                                    <MessageSquare size={40} className="opacity-30" />
                                                </div>
                                                <h3 className="text-stone-900 font-bold text-xl mb-2">선택된 문의 없음</h3>
                                                <p className="text-stone-400 font-medium text-center max-w-xs">목록에서 문의를 선택하여 내용을 확인하고 AI 답장을 작성해보세요.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            {/* MODALS */}

            {/* 0. Share Page Modal (QR Code) */}
            {showShareModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={() => setShowShareModal(false)}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 p-8 text-center animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                        <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 p-2 bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"><X size={20} /></button>

                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20 transform rotate-3">
                            <QrCode size={32} className="text-white" />
                        </div>
                        <h3 className="font-extrabold text-2xl mb-2 text-stone-900">페이지 공유</h3>
                        <p className="text-stone-500 text-sm mb-8 leading-relaxed px-4">이 QR 코드나 링크를 클라이언트에게 공유하여 포트폴리오와 일정을 보여주세요.</p>

                        <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-inner inline-block mb-8 relative min-w-[200px] min-h-[200px] flex items-center justify-center">
                            {isQrLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                                    <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                                    <span className="text-xs font-bold text-stone-400">생성 중...</span>
                                </div>
                            )}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/#/' + user.username)}`}
                                alt="QR Code"
                                onLoad={() => setIsQrLoading(false)}
                                className={`w-48 h-48 mix-blend-multiply transition-opacity duration-300 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={window.location.origin + '/#/' + user.username}
                                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-xs text-stone-900 truncate focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.origin + '/#/' + user.username);
                                    showToast('링크가 복사되었습니다', 'success');
                                }}
                                className="bg-stone-900 text-white px-4 rounded-xl hover:bg-stone-800 transition-colors"
                                title="링크 복사"
                            >
                                <Copy size={18} />
                            </button>
                        </div>

                        {/* Live Preview Button Moved Here */}
                        <button
                            onClick={() => window.open(window.location.origin + '/#/' + user.username, '_blank')}
                            className="w-full mt-4 bg-blue-50 text-blue-600 py-3.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Eye size={18} /> 새 탭에서 미리보기
                        </button>

                    </div>
                </div>
            )}

            {/* 0.5 Edit Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={() => setShowProfileModal(false)}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-extrabold text-2xl text-stone-900">프로필 수정</h3>
                            <button onClick={() => setShowProfileModal(false)} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-900"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">

                            {/* Avatar Upload Selection */}
                            <div className="flex flex-col items-center gap-4 mb-6">
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                    <img
                                        src={editAvatar || 'https://via.placeholder.com/150'}
                                        className="w-24 h-24 rounded-full object-cover ring-4 ring-stone-100 shadow-md"
                                        alt="Avatar Preview"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-white text-xs font-bold flex flex-col items-center">
                                            <UploadCloud size={16} className="mb-1" />
                                            <span>변경</span>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                                alert('파일 크기는 5MB 이하여야 합니다.');
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setEditAvatar(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />

                                {/* Toggle between Link and Upload (Visual Only, logic handles both) */}
                                <div className="w-full">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="h-px bg-stone-200 flex-1"></span>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase">OR Image Link</span>
                                        <span className="h-px bg-stone-200 flex-1"></span>
                                    </div>
                                    <div className="relative">
                                        <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                        <input
                                            value={editAvatar}
                                            onChange={(e) => setEditAvatar(e.target.value)}
                                            placeholder="이미지 주소 (URL) 직접 입력"
                                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">이름</label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">직함 (Role)</label>
                                <input
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">자기소개</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">거주지</label>
                                    <input
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        placeholder="예: 서울, 대한민국"
                                        className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">작업 가능 시기</label>
                                    <input
                                        value={editAvailability}
                                        onChange={(e) => setEditAvailability(e.target.value)}
                                        placeholder="예: 2025년 상반기"
                                        className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">태그 (쉼표로 구분)</label>
                                <input
                                    value={editTags}
                                    onChange={(e) => setEditTags(e.target.value)}
                                    className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                className="w-full bg-stone-900 text-white py-4 rounded-xl text-sm font-bold mt-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 active:scale-95"
                            >
                                저장하기
                            </button>
                        </div>
                    </div >
                </div >
            )
            }

            {/* 1. Add/Edit Project Modal */}
            {
                showProjectModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={() => setShowProjectModal(false)}></div>
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 p-8 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-extrabold text-2xl text-stone-900">{editingProject ? '프로젝트 수정' : '새 프로젝트'}</h3>
                                <button onClick={() => setShowProjectModal(false)} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-900"><X size={20} /></button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">프로젝트명</label>
                                    <input
                                        type="text"
                                        value={projTitle}
                                        onChange={e => setProjTitle(e.target.value)}
                                        className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                        placeholder="예: 웹사이트 리뉴얼"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">시작일</label>
                                        <input
                                            type="date"
                                            value={projStart}
                                            onChange={e => setProjStart(e.target.value)}
                                            className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium [color-scheme:light]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">종료일</label>
                                        <input
                                            type="date"
                                            value={projEnd}
                                            onChange={e => setProjEnd(e.target.value)}
                                            className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium [color-scheme:light]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">상태</label>
                                    <div className="relative">
                                        <select
                                            value={projStatus}
                                            onChange={(e: any) => setProjStatus(e.target.value)}
                                            className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none font-medium"
                                        >
                                            <option value="planning">계획 중</option>
                                            <option value="in-progress">진행 중</option>
                                            <option value="completed">완료됨</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    {editingProject && (
                                        <button
                                            onClick={() => handleDeleteProjectAction(editingProject.id)}
                                            className="flex-1 bg-red-50 text-red-600 py-4 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    )}
                                    <button
                                        onClick={handleSaveProject}
                                        className="flex-1 bg-stone-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 active:scale-95"
                                    >
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 2. Add Portfolio Modal */}
            {
                showAddPortfolio && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={() => setShowAddPortfolio(false)}></div>
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 p-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-extrabold text-2xl text-stone-900">포트폴리오 추가</h3>
                                <button onClick={() => setShowAddPortfolio(false)} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-900"><X size={20} /></button>
                            </div>
                            <div className="space-y-5">
                                {/* Image Upload Area */}
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">커버 이미지</label>
                                    {!newPfImg ? (
                                        <div className="space-y-4">
                                            {/* File Upload Area */}
                                            <div
                                                onClick={() => document.getElementById('portfolio-upload')?.click()}
                                                className="w-full h-32 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
                                            >
                                                <div className="p-3 bg-white rounded-full shadow-sm text-stone-400 group-hover:text-blue-500 transition-colors">
                                                    <UploadCloud size={24} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-bold text-stone-600 group-hover:text-blue-700">이미지 업로드</p>
                                                    <p className="text-[10px] text-stone-400 mt-1">클릭하여 파일 선택 (Max 5MB)</p>
                                                </div>
                                                <input
                                                    id="portfolio-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.size > 5 * 1024 * 1024) {
                                                                alert('파일 크기는 5MB 이하여야 합니다.');
                                                                return;
                                                            }
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setNewPfImg(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* Link Input Area */}
                                            <div className="w-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-px bg-stone-200 flex-1"></span>
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase">OR Image Link</span>
                                                    <span className="h-px bg-stone-200 flex-1"></span>
                                                </div>
                                                <div className="relative">
                                                    <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                                    <input
                                                        value={newPfImg}
                                                        onChange={(e) => setNewPfImg(e.target.value)}
                                                        placeholder="이미지 주소 (URL) 직접 입력"
                                                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 rounded-2xl overflow-hidden relative group">
                                            <img src={newPfImg} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => setNewPfImg('')} className="bg-white text-red-500 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-red-50">
                                                    이미지 제거
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">프로젝트 제목</label>
                                    <input
                                        value={newPfTitle}
                                        onChange={(e) => setNewPfTitle(e.target.value)}
                                        className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                        placeholder="예: 핀테크 앱 리디자인"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">설명</label>
                                    <textarea
                                        value={newPfDesc}
                                        onChange={(e) => setNewPfDesc(e.target.value)}
                                        className="w-full border border-stone-200 bg-stone-50/50 rounded-2xl p-4 text-sm text-stone-900 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:bg-white font-medium"
                                        placeholder="프로젝트에 대해 설명해주세요..."
                                    />
                                    {/* AI ASSISTANT INTEGRATION */}
                                    <AIAssistant
                                        contextTitle={newPfTitle}
                                        onAccept={(text) => setNewPfDesc(text)}
                                    />
                                </div>
                                <button
                                    onClick={handleSavePortfolio}
                                    disabled={!newPfImg || !newPfTitle}
                                    className="w-full bg-stone-900 text-white py-4 rounded-xl text-sm font-bold mt-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};
