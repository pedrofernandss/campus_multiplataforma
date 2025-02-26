import * as type1 from "./drawerButton";
import * as type2 from "./instagramReels";
import * as type3 from "./news";
import * as type4 from "./tag";

export default {
  type1,
  type2,
  type3,
  type4,
};
import { icons } from "../constants";

export interface InstagramReels {
  id: string;
  permalink: string;
  media_type: string;
  thumbnail_url: string;
  aspect_ratio: number;
}

export interface DrawerButtons {
  text?: string;
  icon: keyof typeof icons;
  onPress: () => void;
  type?: "active" | "deactive";
}

export interface News {
  id: string;
  mainTitle: string;
  description: string;
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
