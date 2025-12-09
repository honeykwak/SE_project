import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Monitor, Briefcase, MessageSquare, BarChart, ArrowRight, CheckCircle } from 'lucide-react';

export const InfoPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-blue-100 selection:text-blue-900 text-stone-900">

            {/* Background Gradients (Consistent with Login) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-50/50 to-stone-50"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center transform group-hover:rotate-0 rotate-[-3deg] transition-transform duration-300">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                                    <path d="M16 16l5 5" />
                                    <path d="M21 21v-5h-5" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-stone-900 tracking-tight">SyncUp</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-stone-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors text-sm"
                            >
                                로그인
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                            >
                                무료로 시작하기
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-8 border border-blue-100 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        지금 바로 시작할 수 있습니다
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-8 leading-tight">
                        프리랜서의 모든 순간을 <br className="hidden md:block" />
                        <span className="text-blue-600">SyncUp</span>으로 연결하세요
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        포트폴리오 관리부터 클라이언트 소통, 프로젝트 일정 관리까지.<br className="hidden sm:block" />
                        SyncUp 하나로 당신의 프리랜서 커리어를 완성하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            무료로 시작하기 <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-stone-700 border border-stone-200 rounded-xl font-bold text-lg hover:bg-stone-50 transition-all hover:border-blue-200 hover:text-blue-600 hover:-translate-y-1"
                        >
                            기능 둘러보기
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">
                        성공적인 프리랜싱을 위한 모든 것
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        SyncUp은 프리랜서가 오직 업무에만 집중할 수 있도록<br />
                        가장 필요한 기능들만 모았습니다.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">나만의 포트폴리오</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            복잡한 코딩 없이 완성하는 감각적인 페이지.<br />
                            <span className="font-mono bg-stone-100 px-1 py-0.5 rounded text-blue-600 font-bold">@username</span> 링크 하나로 당신의 커리어를 완벽하게 증명하세요.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Briefcase size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">프로젝트 허브</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            진행 중인 프로젝트의 일정과 상태를 한눈에.<br />
                            체계적인 관리로 클라이언트의 신뢰를 높이고, 마감 기한을 완벽하게 준수하세요.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">간편한 문의 관리</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            이메일, 카카오톡 여기저기 흩어진 문의는 이제 그만.<br />
                            제안 수신부터 수주까지 한 곳에서 편리하게 관리할 수 있습니다.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <BarChart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">실시간 대시보드</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            내 프로필 방문자 통계와 인기 프로젝트를 확인하세요.<br />
                            데이터를 통해 당신의 성장을 추적하고, 전략적으로 어필할 수 있습니다.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <Monitor size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">클라이언트 뷰</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            오직 클라이언트만을 위한 깔끔한 화면.<br />
                            군더더기 없는 디자인으로 당신의 역량을 가장 돋보이게 전달합니다.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-600 transition-colors">할 일 관리</h3>
                        <p className="text-stone-600 leading-relaxed text-sm">
                            프로젝트별 세부 태스크를 놓치지 마세요.<br />
                            진행 상황을 체크하고, 완벽한 결과물을 전달할 수 있도록 돕습니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-4 bg-stone-900 text-white text-center overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
                        지금 바로 시작해보세요
                    </h2>
                    <p className="text-xl text-stone-400 mb-12 max-w-2xl mx-auto font-medium">
                        프리랜서로서의 새로운 도약, SyncUp이 함께합니다.<br />
                        복잡한 절차 없이 이메일로 간편하게 가입하세요.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1"
                    >
                        프로필 생성하기
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-stone-200 py-12 px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-8 opacity-80">
                    <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 16l5 5" />
                            <path d="M21 21v-5h-5" />
                        </svg>
                    </div>
                    <span className="font-bold text-stone-900">SyncUp</span>
                </div>
                <p className="text-stone-500 text-sm">
                    &copy; {new Date().getFullYear()} SyncUp. All rights reserved.
                </p>
            </footer>
        </div>
    );
};
