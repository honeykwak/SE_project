export interface Project {
  _id: string;
  user: string;
  title: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  status: 'planning' | 'active' | 'completed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status?: 'planning' | 'active' | 'completed';
  description?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

