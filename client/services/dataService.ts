import api from './api';
import { Project, PortfolioItem } from '../../types';

const dataService = {
    // --- Projects ---
    getProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    createProject: async (projectData: Project) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    updateProject: async (id: string, projectData: Project) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },

    deleteProject: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },

    // --- Portfolio ---
    getPortfolio: async () => {
        const response = await api.get('/portfolio');
        return response.data;
    },

    createPortfolio: async (portfolioData: PortfolioItem) => {
        const response = await api.post('/portfolio', portfolioData);
        return response.data;
    },

    deletePortfolio: async (id: string) => {
        const response = await api.delete(`/portfolio/${id}`);
        return response.data;
    },

    // --- Inquiries ---
    getInquiries: async () => {
        const response = await api.get('/inquiries');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.put(`/inquiries/${id}/read`);
        return response.data;
    },

    // Public facing inquiry
    sendInquiry: async (username: string, data: any) => {
        const response = await api.post(`/inquiry/${username}`, data);
        return response.data;
    }
};

export default dataService;
