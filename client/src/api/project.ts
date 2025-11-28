import api from './axios';
import type { Project, CreateProjectData, UpdateProjectData } from '../types/project';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const createProject = async (data: CreateProjectData): Promise<Project> => {
  const response = await api.post<Project>('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: UpdateProjectData): Promise<Project> => {
  const response = await api.put<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

