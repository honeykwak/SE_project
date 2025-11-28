export interface PortfolioItem {
  _id: string;
  user: string;
  title: string;
  description?: string;
  imageUrl?: string;
  projectLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioData {
  title: string;
  description?: string;
  imageUrl?: string;
  projectLink?: string;
}

export interface UpdatePortfolioData extends Partial<CreatePortfolioData> {}

