import api from './axios';
import type { Inquiry, CreateInquiryData } from '../types/inquiry';

export const sendInquiry = async (username: string, data: CreateInquiryData): Promise<void> => {
  await api.post(`/inquiry/${username}`, data);
};

export const getInquiries = async (): Promise<Inquiry[]> => {
  const response = await api.get<Inquiry[]>('/inquiries');
  return response.data;
};

export const markInquiryAsRead = async (id: string): Promise<Inquiry> => {
  const response = await api.put<Inquiry>(`/inquiries/${id}/read`);
  return response.data;
};

