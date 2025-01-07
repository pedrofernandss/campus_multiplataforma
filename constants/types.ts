import icons from "./icons";

export interface News {
  id: string;
  mainTitle: string;
  description: number;
  content: string;
  authors: Array<string>;
  thumbnail: string;
  createdAt: string;
  published: boolean;
}

export interface Tag {
    id: string;
    name: string;
    newsCount: number;
    color: string;
}

export interface DrawerButtons {
  text?: string,
  icon: keyof typeof icons,
  onPress: () => void; 
  type?: 'active' | 'deactive', 
}