import api from './axios';
import type { PortfolioItem, CreatePortfolioData, UpdatePortfolioData } from '../types/portfolio';

export const getPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await api.get<PortfolioItem[]>('/portfolio');
  return response.data;
};

export const createPortfolioItem = async (data: CreatePortfolioData): Promise<PortfolioItem> => {
  const response = await api.post<PortfolioItem>('/portfolio', data);
  return response.data;
};

export const updatePortfolioItem = async (id: string, data: UpdatePortfolioData): Promise<PortfolioItem> => {
  const response = await api.put<PortfolioItem>(`/portfolio/${id}`, data);
  return response.data;
};

export const deletePortfolioItem = async (id: string): Promise<void> => {
  await api.delete(`/portfolio/${id}`);
};

