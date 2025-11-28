import type { Project } from './project';
import type { PortfolioItem } from './portfolio';

export interface PublicUser {
  _id: string;
  name: string;
  username: string;
  jobTitle?: string;
  introduction?: string;
}

export interface PublicPageData {
  user: PublicUser;
  projects: Project[];
  portfolio: PortfolioItem[]; // 추가
}

