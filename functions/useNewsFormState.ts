import { useState } from "react";
import { Block } from "../types/blocks";
import { ImageAsset } from '../types/imageTypes';
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

interface NewsData {
  mainTitle: string;
  description: string;
  authors: string[];
  hashtags: string[];
  thumbnail: string;
  blocks: Block[];
}

const initialFormState: NewsFormState = {
  articleTitle: "",
  textDraft: "",
  reporters: [],
  articleTags: [],
  dynamicInputs: [],
  thumbnailUri: null,
};

export const useNewsForm = (initialData?: NewsData): UseNewsFormReturn => {
  // Estados básicos
  const [formData, setFormData] = useState<NewsFormState>(
    initialData ? {
      articleTitle: initialData.mainTitle || '',
      textDraft: initialData.description || '',
      reporters: initialData.authors || [],
      articleTags: initialData.hashtags || [],
      dynamicInputs: initialData.blocks || [],
      thumbnailUri: initialData.thumbnail || null,
    } : initialFormState
  );

  const [temporaryImages, setTemporaryImages] = useState<Record<string, ImageAsset>>(
    initialData ? initialData.blocks.reduce((acc, block) => {
      if (block.type === 'image' && block.content) {
        acc[block.id] = {
          uri: block.content,
          type: 'image/jpeg',
          fileName: `image_${block.id}.jpg`
        };
      }
      return acc;
    }, {} as Record<string, ImageAsset>) : {}
  );

  const [temporaryThumbnail, setTemporaryThumbnail] = useState<ImageAsset | null>(
    initialData?.thumbnail ? {
      uri: initialData.thumbnail,
      type: 'image/jpeg',
      fileName: 'thumbnail.jpg'
    } : null
  );

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
      const newsData = {
        authors: formData.reporters,
        blocks: formData.dynamicInputs,
        createdAt: new Date().toISOString(),
        description: formData.textDraft,
        feedTitle: formData.articleTitle,
        hashtags: formData.articleTags,
        mainTitle: formData.articleTitle,
        published: false,
        thumbnail: formData.thumbnailUri || "",
      };

      await addDoc(collection(db, "news"), newsData);
    } catch (error) {
      console.error("Erro ao enviar notícia:", error);
      Alert.alert("Erro", "Não foi possível enviar a notícia.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (newsId: string) => {
    setIsLoading(true);
    try {
      const updatedData = {
        authors: formData.reporters,
        blocks: formData.dynamicInputs,
        description: formData.textDraft,
        feedTitle: formData.articleTitle,
        hashtags: formData.articleTags,
        mainTitle: formData.articleTitle,
        thumbnail: formData.thumbnailUri || "",
      };

      const newsRef = doc(db, "news", newsId);
      await updateDoc(newsRef, updatedData);
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      Alert.alert("Erro", "Não foi possível atualizar a notícia.");
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