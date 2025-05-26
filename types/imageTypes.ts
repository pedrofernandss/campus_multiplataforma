export interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  serviceUsed: 'imgur' | 'imgbb';
  error?: any;
}

export interface UploadedImage {
  url: string;
  service: string;
} 