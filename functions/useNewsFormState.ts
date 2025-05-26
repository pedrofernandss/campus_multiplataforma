import { useState } from "react";
import { Block } from "../types/blocks";
import { ImageAsset } from '../types/imageTypes';
import { uploadMultipleImages, uploadSingleImage } from './imageUpload';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Alert } from 'react-native';

interface NewsFormState {
  articleTitle: string;
  textDraft: string;
  reporters: string[];
  articleTags: string[];
  dynamicInputs: Block[];
  thumbnailUri: string | null;
}

interface UseNewsFormReturn {
  formData: NewsFormState;
  temporaryImages: Record<string, ImageAsset>;
  temporaryThumbnail: ImageAsset | null;
  isLoading: boolean;
  articleTag: string;
  reporterName: string;
  isDropdownVisible: boolean;
  setFormData: (data: NewsFormState | ((prev: NewsFormState) => NewsFormState)) => void;
  setTemporaryImages: (images: Record<string, ImageAsset>) => void;
  setTemporaryThumbnail: (thumbnail: ImageAsset | null) => void;
  setIsLoading: (loading: boolean) => void;
  setArticleTag: (tag: string) => void;
  setReporterName: (name: string) => void;
  setIsDropdownVisible: (visible: boolean) => void;
  handleSubmit: () => Promise<void>;
  handleUpdate: (newsId: string) => Promise<void>;
  resetForm: () => void;
}

const initialFormState: NewsFormState = {
  articleTitle: "",
  textDraft: "",
  reporters: [],
  articleTags: [],
  dynamicInputs: [],
  thumbnailUri: null,
};

export const useNewsForm = (): UseNewsFormReturn => {
  const [formData, setFormData] = useState<NewsFormState>(initialFormState);
  const [temporaryImages, setTemporaryImages] = useState<Record<string, ImageAsset>>({});
  const [temporaryThumbnail, setTemporaryThumbnail] = useState<ImageAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [articleTag, setArticleTag] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setTemporaryImages({});
    setTemporaryThumbnail(null);
    setArticleTag("");
    setReporterName("");
    setIsDropdownVisible(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let finalThumbnailUri = formData.thumbnailUri;
      let updatedDynamicInputs = [...formData.dynamicInputs];

      // Upload da thumbnail se existir
      if (temporaryThumbnail) {
        const result = await uploadSingleImage(temporaryThumbnail);
        if (result.success && result.url) {
          finalThumbnailUri = result.url;
        }
      }

      // Upload das imagens dos blocos
      if (Object.keys(temporaryImages).length > 0) {
        const { urls } = await uploadMultipleImages(temporaryImages);
        updatedDynamicInputs = updatedDynamicInputs.map(input => {
          if (input.type === 'image' && urls[input.id]) {
            return { ...input, content: urls[input.id].url };
          }
          return input;
        });
      }

      const newsData = {
        authors: formData.reporters,
        blocks: updatedDynamicInputs,
        createdAt: new Date().toISOString(),
        description: formData.textDraft,
        feedTitle: formData.articleTitle,
        hashtags: formData.articleTags,
        mainTitle: formData.articleTitle,
        published: false,
        thumbnail: finalThumbnailUri || "",
      };

      await addDoc(collection(db, "news"), newsData);
      resetForm();
      return true;
    } catch (error) {
      console.error("Erro ao enviar notícia:", error);
      Alert.alert("Erro", "Não foi possível enviar a notícia.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (newsId: string) => {
    setIsLoading(true);
    try {
      let finalThumbnailUri = formData.thumbnailUri;
      let updatedDynamicInputs = [...formData.dynamicInputs];

      if (temporaryThumbnail) {
        const result = await uploadSingleImage(temporaryThumbnail);
        if (result.success && result.url) {
          finalThumbnailUri = result.url;
        }
      }

      if (Object.keys(temporaryImages).length > 0) {
        const { urls } = await uploadMultipleImages(temporaryImages);
        updatedDynamicInputs = updatedDynamicInputs.map(input => {
          if (input.type === 'image' && urls[input.id]) {
            return { ...input, content: urls[input.id].url };
          }
          return input;
        });
      }

      const updatedData = {
        authors: formData.reporters,
        blocks: updatedDynamicInputs,
        description: formData.textDraft,
        feedTitle: formData.articleTitle,
        hashtags: formData.articleTags,
        mainTitle: formData.articleTitle,
        thumbnail: finalThumbnailUri || "",
      };

      const newsRef = doc(db, "news", newsId);
      await updateDoc(newsRef, updatedData);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      Alert.alert("Erro", "Não foi possível atualizar a notícia.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    temporaryImages,
    temporaryThumbnail,
    isLoading,
    articleTag,
    reporterName,
    isDropdownVisible,
    setFormData,
    setTemporaryImages,
    setTemporaryThumbnail,
    setIsLoading,
    setArticleTag,
    setReporterName,
    setIsDropdownVisible,
    handleSubmit,
    handleUpdate,
    resetForm,
  };
};