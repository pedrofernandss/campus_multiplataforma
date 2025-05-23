import { icons } from "../constants";

export interface ModalBox {
  title?: string;
  label: string;
  icon?: keyof typeof icons;
  isOpen: boolean;
  hasInput?: boolean;
  onConfirmButton?: () => void;
  onCancelButton?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  inputValue?: string;
  onInputChange?: (text: string) => void;
}
