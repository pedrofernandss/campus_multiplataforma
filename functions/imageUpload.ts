import { ImageAsset } from '../types/imageTypes';

interface UploadResult {
  success: boolean;
  url?: string;
  serviceUsed: 'imgur' | 'imgbb';
  error?: any;
}

const tryImgurUpload = async (imageAsset: ImageAsset): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      name: imageAsset.fileName,
    });

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        url: data.data.link,
        serviceUsed: 'imgur'
      };
    } else {
      return {
        success: false,
        serviceUsed: 'imgur',
        error: data
      };
    }
  } catch (error) {
    return {
      success: false,
      serviceUsed: 'imgur',
      error: error
    };
  }
};

const tryImgBBUpload = async (imageAsset: ImageAsset): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      name: imageAsset.fileName,
    });

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.EXPO_PUBLIC_IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        serviceUsed: 'imgbb'
      };
    } else {
      return {
        success: false,
        serviceUsed: 'imgbb',
        error: data
      };
    }
  } catch (error) {
    return {
      success: false,
      serviceUsed: 'imgbb',
      error: error
    };
  }
};

export const uploadSingleImage = async (imageAsset: ImageAsset): Promise<UploadResult> => {
  const imgurResult = await tryImgurUpload(imageAsset);
  if (imgurResult.success) {
    return imgurResult;
  }

  console.warn('Imgur falhou, tentando ImgBB...', imgurResult.error);

  const imgbbResult = await tryImgBBUpload(imageAsset);
  if (imgbbResult.success) {
    return imgbbResult;
  }

  console.error('Ambos Imgur e ImgBB falharam', imgbbResult.error);
  return {
    success: false,
    serviceUsed: 'imgbb',
    error: imgbbResult.error
  };
};

export const uploadMultipleImages = async (images: Record<string, ImageAsset>) => {
  const uploadedUrls: Record<string, {url: string, service: string}> = {};
  let anyUploadFailed = false;

  for (const [id, imageAsset] of Object.entries(images)) {
    const result = await uploadSingleImage(imageAsset);
    if (result.success) {
      uploadedUrls[id] = {
        url: result.url,
        service: result.serviceUsed
      };
    } else {
      anyUploadFailed = true;
    }
  }

  return {
    urls: uploadedUrls,
    allSuccess: !anyUploadFailed
  };
};
