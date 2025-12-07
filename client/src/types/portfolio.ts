
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  projectLink?: string; // Legacy support
  link?: string; // v2 support
}

export interface CreatePortfolioData {
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  projectLink?: string;
  link?: string;
}

export interface UpdatePortfolioData extends Partial<CreatePortfolioData> { }
