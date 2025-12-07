
import * as projectApi from '../api/project';
import * as portfolioApi from '../api/portfolio';
import * as authApi from '../api/auth';
import type { Project, PortfolioItem, UserProfile, CreatePortfolioData } from '../types';

// Map Backend Project to Frontend Project
const mapProject = (p: any): Project => ({
    id: p._id,
    title: p.title,
    client: 'Client Name', // Placeholder as backend doesn't have this
    startDate: p.startDate ? p.startDate.split('T')[0] : '', // Extract YYYY-MM-DD
    endDate: p.endDate ? p.endDate.split('T')[0] : '',
    status: p.status === 'active' ? 'in-progress' : (p.status || 'planning'),
    description: p.description || ''
});

// Map Backend Portfolio to Frontend Portfolio
const mapPortfolio = (p: any): PortfolioItem => ({
    id: p._id,
    title: p.title,
    category: p.category || 'Project', // Ensure category exists
    imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000', // Fallback image
    description: p.description || '',
    projectLink: p.projectLink
});

export const apiService = {
    // Projects
    async getProjects(): Promise<Project[]> {
        try {
            const projects = await projectApi.getProjects();
            return projects.map(mapProject);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            return [];
        }
    },

    async createProject(project: Omit<Project, 'id'>) {
        // Map frontend project back to backend format if needed
        // For now, simplistically passing data. 
        // Note: status mapping needed 'in-progress' -> 'active'
        const backendStatus = project.status === 'in-progress' ? 'active' : project.status;
        return projectApi.createProject({
            title: project.title,
            startDate: project.startDate,
            endDate: project.endDate,
            status: backendStatus as 'active' | 'planning' | 'completed',
            description: project.description
        } as any);
    },

    async deleteProject(id: string) {
        return projectApi.deleteProject(id);
    },

    async updateProject(project: Project) {
        const backendStatus = project.status === 'in-progress' ? 'active' : project.status;
        return projectApi.updateProject(project.id, {
            title: project.title,
            startDate: project.startDate,
            endDate: project.endDate,
            status: backendStatus as 'active' | 'planning' | 'completed',
            description: project.description
        } as any);
    },

    // Portfolio
    async getPortfolio(): Promise<PortfolioItem[]> {
        try {
            const items = await portfolioApi.getPortfolioItems();
            return items.map(mapPortfolio);
        } catch (error) {
            console.error("Failed to fetch portfolio", error);
            return [];
        }
    },

    async createPortfolio(item: CreatePortfolioData) {
        return portfolioApi.createPortfolioItem({
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl,
            description: item.description,
            projectLink: item.projectLink
        });
    },

    async deletePortfolio(id: string) {
        return portfolioApi.deletePortfolioItem(id);
    },

    // Auth
    async login(credentials: any) {
        return authApi.login(credentials);
    },

    async register(credentials: any) {
        return authApi.registerUser(credentials);
    },

    // Mock User Profile (since we might not have a full profile endpoint yet)
    getUserProfile(): UserProfile {
        // Check if we have user info in localStorage or decode token? 
        // For now returning the mock user but we could enhance this later.
        return {
            name: "김디자인",
            role: "프로덕트 & 브랜드 디자이너",
            bio: "복잡한 문제를 우아한 사용자 경험으로 풀어냅니다.",
            email: "alex@syncup.com",
            avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
            tags: ["UI/UX", "React", "디자인 시스템"]
        };
    }
};
