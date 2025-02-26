import { News } from "../types/news";

export interface ProgressBox {
  newsId: string;
  label: string;
  isOpen: boolean;
  onClose?: () => void;
  type?: "approve" | "delete" | null;
}
