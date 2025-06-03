import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNewsForm } from "../functions/useNewsFormState";
import { ImageUploadField } from "../components/ImageUploadField";
import { ImageBlock } from "../components/ImageBlock";
import { TextBlock } from "../components/TextBlock";
import { VideoBlock } from "../components/VideoBlock";
import { AddBlockMenu } from "../components/AddBlockMenu";
import HeaderEditor from "../components/HeaderEditor";
import FixedInputs from "../components/FixedInputs";
import CardsSection from "../components/CardSection";
import standard from "../theme";
import { ImageAsset } from "../types/imageTypes";
import { Block } from "../types/blocks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const typeMapping = {
  Tópico: "subheading",
  Texto: "text",
  Imagem: "image",
  Vídeo: "video",
} as const;

type FriendlyType = keyof typeof typeMapping;

export default function NewsForm() {
  const router = useRouter();
  const { newsData, formState, temporaryImages: savedImages, temporaryThumbnail: savedThumbnail } = useLocalSearchParams();
  const parsedNewsData = newsData ? JSON.parse(String(newsData)) : null;
  const parsedFormState = formState ? JSON.parse(String(formState)) : null;
  const parsedImages = savedImages ? JSON.parse(String(savedImages)) : null;
  const parsedThumbnail = savedThumbnail ? JSON.parse(String(savedThumbnail)) : null;

  const {
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
    setArticleTag,
    setReporterName,
    setIsDropdownVisible,
    handleSubmit,
    handleUpdate,
    resetForm
  } = useNewsForm(parsedNewsData ? {
    mainTitle: parsedNewsData.mainTitle,
    description: parsedNewsData.description,
    authors: parsedNewsData.authors,
    hashtags: parsedNewsData.hashtags,
    thumbnail: parsedNewsData.thumbnail,
    blocks: parsedNewsData.blocks,
  } : undefined);

  useEffect(() => {
    if (parsedFormState) {
      setFormData(parsedFormState);
    } else if (parsedNewsData) {
      setFormData({
        articleTitle: parsedNewsData.mainTitle || '',
        textDraft: parsedNewsData.description || '',
        reporters: parsedNewsData.authors || [],
        articleTags: parsedNewsData.hashtags || [],
        dynamicInputs: parsedNewsData.blocks || [],
        thumbnailUri: parsedNewsData.thumbnail || null,
      });
    }

    if (parsedImages) {
      setTemporaryImages(parsedImages);
    } else if (parsedNewsData) {
      const newTempImages: Record<string, ImageAsset> = {};
      parsedNewsData.blocks.forEach(block => {
        if (block.type === 'image' && block.content) {
          newTempImages[block.id] = {
            uri: block.content,
            type: 'image/jpeg',
            fileName: `image_${block.id}.jpg`
          };
        }
      });
      setTemporaryImages(newTempImages);
    }

    if (parsedThumbnail) {
      setTemporaryThumbnail(parsedThumbnail);
    } else if (parsedNewsData?.thumbnail) {
      setTemporaryThumbnail({
        uri: parsedNewsData.thumbnail,
        type: 'image/jpeg',
        fileName: 'thumbnail.jpg'
      });
    }

    return () => {
      resetForm();
    };
  }, [newsData, formState, savedImages, savedThumbnail]);

  const handleInputChange = (id: string, value: string, caption?: string) => {
    setFormData((prev) => ({
      ...prev,
      dynamicInputs: prev.dynamicInputs.map((input) => {
        if (input.id === id) {
          if (caption !== undefined) {
            return { ...input, caption };
          } else {
            return { ...input, content: value };
          }
        }
        return input;
      }),
    }));
  };

  const handleAddInput = (friendlyType: FriendlyType) => {
    const technicalType = typeMapping[friendlyType];
    const newInput = {
      id: `${Date.now()}-${Math.random()}`,
      type: technicalType,
      content: "",
      order: formData.dynamicInputs.length + 1,
    };

    setFormData((prev) => ({
      ...prev,
      dynamicInputs: [...prev.dynamicInputs, newInput],
    }));
    setIsDropdownVisible(false);
  };

  const handleRemoveInput = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      dynamicInputs: prev.dynamicInputs.filter((input) => input.id !== id),
    }));
  };

  const handleImageSelected = (id: string, imageAsset: ImageAsset) => {
    const newImages = { ...temporaryImages };
    newImages[id] = imageAsset;
    setTemporaryImages(newImages);
    handleInputChange(id, imageAsset.uri);
  };

  const handleThumbnailSelected = (imageAsset: ImageAsset) => {
    setTemporaryThumbnail(imageAsset);
    setFormData((prev) => ({
      ...prev,
      thumbnailUri: imageAsset.uri,
    }));
  };

  const handlePreview = () => {
    const previewData = {
      mainTitle: formData.articleTitle,
      description: formData.textDraft,
      authors: formData.reporters,
      hashtags: formData.articleTags,
      thumbnail: formData.thumbnailUri || "",
      blocks: formData.dynamicInputs,
      published: false,
      createdAt: new Date().toISOString(),
    };

    router.push({
      pathname: "/previewPage",
      params: { 
        previewData: JSON.stringify(previewData),
        editData: JSON.stringify({
          newsData: parsedNewsData || previewData,
          formState: formData,
          images: temporaryImages,
          thumbnail: temporaryThumbnail
        })
      },
    });
  };

  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('newsFormState');
        if (savedState && !parsedNewsData) {
          const { formData: savedFormData, temporaryImages: savedImages, temporaryThumbnail: savedThumbnail } = JSON.parse(savedState);
          setFormData(savedFormData);
          setTemporaryImages(savedImages);
          setTemporaryThumbnail(savedThumbnail);
          await AsyncStorage.removeItem('newsFormState');
        }
      } catch (error) {
        console.error("Erro ao recuperar estado:", error);
      }
    };

    loadSavedState();
  }, []);

  const handleSaveOrSubmit = async () => {
    try {
      if (parsedNewsData?.id) {
        await handleUpdate(parsedNewsData.id);
        Alert.alert(
          "Sucesso", 
          "Notícia atualizada com sucesso!",
          [
            { 
              text: "OK", 
              onPress: () => {
                resetForm();
                router.replace("/");
              }
            }
          ]
        );
      } else {
        await handleSubmit();
        resetForm();
        router.push("/confirmationPage");
      }
    } catch (error) {
      console.error("Erro ao salvar/enviar:", error);
      Alert.alert("Erro", "Ocorreu um erro ao processar a notícia.");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderEditor />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CardsSection />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={standard.colors.campusRed} />
            <Text style={styles.loadingText}>Enviando notícia...</Text>
          </View>
        )}

        <Text style={styles.title}>Informações do texto</Text>
        
        <View style={styles.thumbnailContainer}>
          <ImageUploadField
            imageUri={formData.thumbnailUri}
            onImageSelected={handleThumbnailSelected}
            label="Thumbnail"
          />
        </View>

        <FixedInputs
          articleTitle={formData.articleTitle}
          setArticleTitle={(value) =>
            setFormData((prev) => ({ ...prev, articleTitle: value }))
          }
          textDraft={formData.textDraft}
          setTextDraft={(value) =>
            setFormData((prev) => ({ ...prev, textDraft: value }))
          }
          reporters={formData.reporters}
          handleReporterChange={(text) => {
            if (text.endsWith(",")) {
              const names = text
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);
              setFormData((prev) => ({
                ...prev,
                reporters: [...prev.reporters, ...names],
              }));
              setReporterName("");
            } else {
              setReporterName(text);
            }
          }}
          reporterName={reporterName}
          handleRemoveReporter={(index) =>
            setFormData((prev) => ({
              ...prev,
              reporters: prev.reporters.filter((_, i) => i !== index),
            }))
          }
          articleTags={formData.articleTags}
          articleTag={articleTag}
          handleTagsChange={(text) => {
            if (text.endsWith(" ")) {
              const tags = text
                .split(" ")
                .map((tag) => tag.trim())
                .filter(Boolean);
              setFormData((prev) => ({
                ...prev,
                articleTags: [...prev.articleTags, ...tags.map((tag) => `#${tag}`)],
              }));
              setArticleTag("");
            } else {
              setArticleTag(text);
            }
          }}
          handleRemoveTag={(index) =>
            setFormData((prev) => ({
              ...prev,
              articleTags: prev.articleTags.filter((_, i) => i !== index),
            }))
          }
        />

        {formData.dynamicInputs.map((input) => {
          switch (input.type) {
            case "image":
              return (
                <ImageBlock
                  key={input.id}
                  id={input.id}
                  content={input.content}
                  caption={input.caption}
                  onImageSelected={handleImageSelected}
                  onCaptionChange={(id, content, caption) => handleInputChange(id, content, caption)}
                  onRemove={handleRemoveInput}
                />
              );
            case "video":
              return (
                <VideoBlock
                  key={input.id}
                  id={input.id}
                  content={input.content}
                  onContentChange={handleInputChange}
                  onRemove={handleRemoveInput}
                />
              );
            default:
              return (
                <TextBlock
                  key={input.id}
                  id={input.id}
                  content={input.content}
                  type={input.type as 'text' | 'subheading'}
                  onContentChange={handleInputChange}
                  onRemove={handleRemoveInput}
                />
              );
          }
        })}

        <TouchableOpacity
          style={styles.addInputButton}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.addInputButtonText}>+ Adicionar novo campo</Text>
        </TouchableOpacity>

        <AddBlockMenu
          visible={isDropdownVisible}
          onSelect={handleAddInput}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.previewButton]}
            onPress={handlePreview}
          >
            <Text style={styles.previewText}>Pré-visualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSaveOrSubmit}
          >
            <Text style={styles.submitText}>
              {parsedNewsData ? "Salvar Alterações" : "Enviar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: standard.colors.primaryWhite,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  thumbnailContainer: {
    marginBottom: 16,
  },
  addInputButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addInputButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  previewButton: {
    backgroundColor: "#DEDAD5",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: standard.colors.campusRed,
    marginLeft: 8,
  },
  previewText: {
    color: "#423B34",
    fontWeight: "bold",
    fontSize: 15,
  },
  submitText: {
    color: standard.colors.primaryWhite,
    fontWeight: "bold",
    fontSize: 15,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    color: standard.colors.campusRed,
    fontSize: 16,
  },
});
