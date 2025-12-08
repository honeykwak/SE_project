import api from './api';
import { Project, PortfolioItem } from '../types';

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
        // Map backend schema (senderName, etc.) to frontend Message type (fromName, etc.)
        return response.data.map((item: any) => ({
            id: item._id,
            fromName: item.senderName,
            fromEmail: item.senderEmail,
            subject: '새로운 프로젝트 문의', // Backend doesn't have subject, providing default
            content: item.message,
            date: new Date(item.createdAt).toISOString().split('T')[0],
            read: item.isRead
        }));
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
