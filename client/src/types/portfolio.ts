
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  projectLink?: string;
}

export interface CreatePortfolioData {
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  projectLink?: string;
}

export interface UpdatePortfolioData extends Partial<CreatePortfolioData> { }
