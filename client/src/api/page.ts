import api from './axios';
import type { PublicPageData } from '../types/page';

export const getPublicPageData = async (username: string): Promise<PublicPageData> => {
  const response = await api.get<PublicPageData>(`/page/${username}`);
  return response.data;
};

