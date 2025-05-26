export interface Block {
  id: string;
  type: 'text' | 'subheading' | 'image' | 'video';
  content: string;
  caption?: string;
  order: number;
}

export interface NewsData {
  id?: string;
  mainTitle: string;
  description: string;
  authors: string[];
  hashtags: string[];
  thumbnail: string;
  blocks: Block[];
  published: boolean;
  createdAt: string;
}