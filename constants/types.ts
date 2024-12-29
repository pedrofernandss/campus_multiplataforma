import icons from "./icons";

export interface News {
  id: string;
  title: string;
  subtitle: number;
  content: string;
  author: string;
  cover_image: string;
  created_at: string;
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