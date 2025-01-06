import icons from "./icons";

export interface News {
  id: string;
  mainTitle: string;
  description: number;
  content: string;
  authors: Array<string>;
  thumbnail: string;
  created_at: string;
}

export interface Tag {
    id: string;
    name: string;
    newsCount: number;
    color: string;
}

export interface InstagramReels {
  id: string;
  permalink: string;
  media_type: string;
  thumbnail_url: string;
}

export interface DrawerButtons {
  text?: string,
  icon: keyof typeof icons,
  onPress: () => void; 
  type?: 'active' | 'deactive', 
}