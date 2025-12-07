import api from './api';
import { UserProfile, Project, PortfolioItem } from '../../types';

export interface PublicPageData {
    user: UserProfile;
    projects: Project[];
    portfolio: PortfolioItem[];
}

const pageService = {
    getPublicPage: async (username: string): Promise<PublicPageData> => {
        const response = await api.get(`/page/${username}`);
        return response.data;
    },

    sendInquiry: async (username: string, data: { fromEmail: string; content: string }) => {
        const response = await api.post(`/inquiry/${username}`, data);
        return response.data;
    }
};

export default pageService;
