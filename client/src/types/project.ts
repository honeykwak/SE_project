
export interface Project {
  id: string;
  title: string;
  client: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'planning' | 'in-progress' | 'completed';
  description?: string;
}

export interface CreateProjectData {
  title: string;
  startDate: string;
  endDate: string;
  status?: 'planning' | 'in-progress' | 'completed';
  description?: string;
  client?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> { }
