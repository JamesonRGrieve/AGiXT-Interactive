export interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  price: number;
  rating: number;
  downloads: number;
  imageUrl: string;
  status: string;
  type: string;
  version?: string;
  stars?: number;
  updatedAt?: string;
  category?: string;
  tags?: string[];
  icon?: string;
}