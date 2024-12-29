import { GestureResponderEvent } from "react-native";
import icons from "./icons";

export interface Tag {
    id: string;
    name: string;
    newsCount: number;
    color: string;
}

export interface DrawerButtons {
  text?: string,
  icon: keyof typeof icons,
  onPress: (event: GestureResponderEvent) => void; 
  type?: string, 
}