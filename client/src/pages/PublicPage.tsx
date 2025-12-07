
import React, { useState, useEffect } from 'react';
import type { UserProfile, Project, PortfolioItem } from '../types';
import { Timeline } from '../components/Timeline';
import { PortfolioGrid } from '../components/PortfolioGrid';
import { apiService } from '../services/api';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  Mail,
  Link as LinkIcon,
  Download,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const PublicPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Data State
  const [user] = useState<UserProfile>(apiService.getUserProfile());
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Ideally fetch specific user data by username. 
      // For now fetching global/current user data as per current backend capability.
      const fetchedProjects = await apiService.getProjects();
      setProjects(fetchedProjects);
      const fetchedPortfolio = await apiService.getPortfolio();
      setPortfolio(fetchedPortfolio);
      // setUser(...) if backend supports fetching public profile by username
    };
    fetchData();
  }, [username]);

  const handleSendInquiry = () => {
    setInquiryStatus('loading');
    setTimeout(() => {
      setInquiryStatus('success');
    }, 1500);
  };

  const resetInquiry = () => {
    setInquiryOpen(false);
    setTimeout(() => setInquiryStatus('idle'), 300);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-blue-100 selection:text-blue-900">

      {/* 1. Header Section */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 transition-all">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tight text-stone-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              </svg>
            </div>
            SyncUp.
          </div>
          <button onClick={() => setInquiryOpen(true)} className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-stone-800 transition-all hover:shadow-lg active:scale-95">문의하기</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-24">

        {/* 2. Profile Intro */}
        <section className="flex flex-col md:flex-row gap-12 items-center md:items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500 blur-xl"></div>
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white relative z-10 transform transition-transform duration-500 group-hover:scale-105">
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 z-20 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold border-4 border-white shadow-lg flex items-center gap-1 animate-bounce">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              프로젝트 수주 가능
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-3 tracking-tight leading-tight">{user.name}</h1>
              <p className="text-lg text-stone-500 font-medium flex items-center justify-center md:justify-start gap-2">
                {user.role} <span className="w-1.5 h-1.5 bg-stone-300 rounded-full"></span> 서울 거주
              </p>
            </div>
            <p className="text-stone-600 leading-relaxed text-lg max-w-xl">{user.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {user.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-full text-sm font-semibold shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default">{tag}</span>
              ))}
            </div>
            <div className="flex justify-center md:justify-start gap-6 pt-2 text-sm font-bold text-stone-400">
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                <div className="p-2 bg-white rounded-full border border-stone-200 group-hover:border-blue-200 group-hover:bg-blue-50"><LinkIcon size={16} /></div> website.com
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                <div className="p-2 bg-white rounded-full border border-stone-200 group-hover:border-blue-200 group-hover:bg-blue-50"><Mail size={16} /></div> email@me.com
              </a>
            </div>
          </div>
        </section>

        {/* 3. Availability & Timeline */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={24} /></div>
              업무 일정 (Availability)
            </h2>
            <span className="text-sm font-semibold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">2024년 하반기</span>
          </div>
          <div className="bg-white p-2 rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <Timeline projects={projects} onProjectClick={setSelectedProject} />
            </div>
          </div>
        </section>

        {/* 4. Portfolio Grid */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Download size={24} /></div>
              포트폴리오 (Portfolio)
            </h2>
            <a href="#" className="group flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
              전체 보기 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <PortfolioGrid items={portfolio} />
        </section>

        {/* 5. Inquiry Form Modal */}
        {inquiryOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={resetInquiry}></div>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="absolute top-0 right-0 p-4 z-20">
                <button onClick={resetInquiry} className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors backdrop-blur-sm"><X size={20} /></button>
              </div>
              {inquiryStatus === 'success' ? (
                <div className="p-16 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce"><CheckCircle2 size={40} /></div>
                  <h3 className="text-2xl font-extrabold text-stone-900 mb-2">문의가 전달되었습니다!</h3>
                  <button onClick={resetInquiry} className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors mt-8">확인</button>
                </div>
              ) : (
                <>
                  <div className="bg-blue-600 p-10 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                    <h3 className="text-3xl font-extrabold mb-2 relative z-10">프로젝트 의뢰하기</h3>
                    <p className="text-blue-100 font-medium relative z-10">일정과 목표를 알려주시면 빠르게 답변 드리겠습니다.</p>
                  </div>
                  <div className="p-8 space-y-6">
                    <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">이메일</label><input type="email" className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm font-medium" placeholder="user@company.com" /></div>
                    <div><label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">문의 내용</label><textarea className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm h-32 resize-none font-medium" placeholder="프로젝트에 대해 설명해주세요..." /></div>
                    <button onClick={handleSendInquiry} disabled={inquiryStatus === 'loading'} className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                      {inquiryStatus === 'loading' ? <><Loader2 size={18} className="animate-spin" /> 전송 중...</> : <><Loader2 size={18} className="hidden" /> 문의 보내기 <Send size={18} /></>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 6. Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md transition-opacity" onClick={() => setSelectedProject(null)}></div>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 p-8 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${selectedProject.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : selectedProject.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'}`}>
                    {selectedProject.status === 'in-progress' ? '진행 중' : selectedProject.status === 'completed' ? '완료됨' : '계획 중'}
                  </span>
                  <h3 className="text-2xl font-extrabold text-stone-900 leading-tight">{selectedProject.title}</h3>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 bg-stone-50 rounded-full text-stone-400 hover:bg-stone-100"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                  <div><div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">클라이언트</div><div className="font-bold text-stone-900 text-sm">{selectedProject.client}</div></div>
                  <div className="w-px bg-stone-200"></div>
                  <div><div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">기간</div><div className="font-bold text-stone-900 text-sm">{selectedProject.startDate} ~ {selectedProject.endDate}</div></div>
                </div>
                <div><div className="text-xs font-bold text-stone-500 uppercase mb-2">프로젝트 설명</div><p className="text-stone-600 text-sm leading-relaxed">{selectedProject.description || '상세 설명이 없습니다.'}</p></div>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-white border-t border-stone-200 py-12 mt-20 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <span className="font-bold text-stone-900">SyncUp.</span>
        </div>
        <p className="text-stone-400 text-sm">Professional Freelance Hub. <br />© 2024 All rights reserved.</p>
      </footer>
    </div>
  );
};
