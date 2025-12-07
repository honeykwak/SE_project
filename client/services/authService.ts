import api from './api';
import { UserProfile } from '../../types'; // Adjust path if types.ts is in client root

interface LoginResponse {
    _id: string;
    name: string;
    email: string;
    username: string;
    token: string;
}

// Adjust UserProfile to match backend response if needed, 
// or map it. For now, assuming backend response fits loosely or we adapt.

const authService = {
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (userData: any) => {
        const response = await api.post('/auth/login', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Verify token with backend
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

export default authService;
