export interface Project {
  id: string;
  title: string;
  client: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed';
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  link?: string;
}

export interface Message {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  avatarUrl: string;
  tags: string[];
}
