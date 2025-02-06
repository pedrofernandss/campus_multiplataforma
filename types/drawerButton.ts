import { icons } from "../constants";

export interface DrawerButtons {
    text?: string;
    icon: keyof typeof icons;
    onPress: () => void;
    type?: 'active' | 'deactive';
}