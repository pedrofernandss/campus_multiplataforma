import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  TextInput,
  Linking,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CardsSection from "../components/CardSection";
import HeaderEditor from "../components/HeaderEditor";
import FixedInputs from "../components/FixedInputs";
import standard from "../theme";
import { db } from "../firebase.config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from 'expo-file-system';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'react-native-blob-util';

const { width } = Dimensions.get("window");


interface UploadResult {
  success: boolean;
  url?: string;
  serviceUsed: 'imgur' | 'imgbb';
  error?: any;
}

interface ImageAsset {
  uri: string;
  type?: string;
  fileName?: string;
}


interface Block {
  id: string;
  type: string;
  content: string;
  caption?: string;
  order: number;
}

interface NewsData {
  id: string;
  mainTitle: string;
  description: string;
  authors: string[];
  hashtags: string[];
  thumbnail: string;
  blocks: Block[];
  published: boolean;
  createdAt: string;
}

export default function NewsForm() {
  const router = useRouter();
  const { newsData } = useLocalSearchParams();
  const parsedNewsData: NewsData | null = newsData
    ? JSON.parse(String(newsData))
    : null;

  const [formData, setFormData] = useState<{
    articleTitle: string;
    textDraft: string;
    reporters: string[];
    articleTags: string[];
    dynamicInputs: Block[];
    thumbnailUri: string | null;
  }>({
    articleTitle: "",
    textDraft: "",
    reporters: [],
    articleTags: [],
    dynamicInputs: [],
    thumbnailUri: null,
  });

  const [temporaryImages, setTemporaryImages] = useState<Record<string, ImageAsset>>({}); // Imagens armazenadas em "cache" sem precisar utilizar o base64
  const [temporaryThumbnail, setTemporaryThumbnail] = useState<ImageAsset | null>(null); // thumb
  const [isLoading, setIsLoading] = useState(false);
  const [articleTag, setArticleTag] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const typeMapping = {
    Tópico: "subheading",
    Texto: "text",
    Imagem: "image",
    Vídeo: "video",
  } as const;

  type FriendlyType = keyof typeof typeMapping;

  const resetFormData = () => {
    setFormData({
      articleTitle: "",
      textDraft: "",
      reporters: [],
      articleTags: [],
      dynamicInputs: [],
      thumbnailUri: null,
    });
  };

  useEffect(() => {
    if (newsData) {
      try {
        const parsed = JSON.parse(String(newsData));
        setFormData({
          articleTitle: parsed.mainTitle,
          textDraft: parsed.description,
          reporters: parsed.authors,
          articleTags: parsed.hashtags,
          dynamicInputs: parsed.blocks,
          thumbnailUri: parsed.thumbnail,
        });
  
        return () => {
          resetFormData();
        };
      } catch (error) {
        console.warn("Erro ao fazer parse de newsData", error);
      }
    }
  }, [newsData]);  

  const handleInputChange = (id: string, value: string, caption?: string) => {
    setFormData((prev) => ({
      ...prev,
      dynamicInputs: prev.dynamicInputs.map((input) =>
        input.id === id
          ? { ...input, content: value, ...(caption !== undefined && { caption }) }
          : input
      ),
    }));
  };

  const handleAddInput = (friendlyType: FriendlyType) => {
    const technicalType = typeMapping[friendlyType];
    const newInput: Block = {
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

  const handleReporterChange = (text: string) => {
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
  };

  const handleRemoveReporter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      reporters: prev.reporters.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      articleTags: prev.articleTags.filter((_, i) => i !== index),
    }));
  };

  const handleTagsChange = (text: string) => {
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
  };

const uploadImagesToImgur = async () => {
  const uploadedUrls: Record<string, {url: string, service: string}> = {};
  let anyUploadFailed = false;

  // Upload da thumbnail
  if (temporaryThumbnail) {
    const result = await uploadSingleImage(temporaryThumbnail);
    if (result.success) {
      uploadedUrls.thumbnail = {
        url: result.url,
        service: result.serviceUsed
      };
    } else {
      anyUploadFailed = true;
    }
  }
  
  // Upload das imagens dos blocos
  for (const [id, imageAsset] of Object.entries(temporaryImages)) {
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

// const tryImgurUpload = async (imageAsset: ImageAsset): Promise<UploadResult> => {
//   try {
//     const formData = new FormData();
//     formData.append('image', {
//       uri: imageAsset.uri,
//       type: imageAsset.type,
//       name: imageAsset.fileName,
//     });

//     const response = await fetch('https://api.imgur.com/3/image', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Client-ID ${process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID}`,
//         'Content-Type': 'multipart/form-data',
//       },
//       body: formData,
//     });

//     const data = await response.json();
    
//     if (data.success) {
//       return {
//         success: true,
//         url: data.data.link,
//         serviceUsed: 'imgur'
//       };
//     } else {
//       return {
//         success: false,
//         serviceUsed: 'imgur',
//         error: data
//       };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       serviceUsed: 'imgur',
//       error: error
//     };
//   }
// };

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

const uploadSingleImage = async (imageAsset: ImageAsset): Promise<UploadResult> => {
  // Primeiro tenta com Imgur
  // const imgurResult = await tryImgurUpload(imageAsset);
  // if (imgurResult.success) {
  //   return imgurResult;
  // }

  // console.warn('Imgur failed, trying ImgBB...', imgurResult.error);
  
  // Se Imgur falhar, tenta com ImgBB
  const imgbbResult = await tryImgBBUpload(imageAsset);
  if (imgbbResult.success) {
    return imgbbResult;
  }

  console.error('Both Imgur and ImgBB failed', imgbbResult.error);
  return {
    success: false,
    serviceUsed: 'imgbb',
    error: imgbbResult.error
  };
};

const pickImage = async (id: string) => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 1,
  });

  if (result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    if (asset.uri) {
      const imageAsset = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
      };
      
      setTemporaryImages(prev => ({...prev, [id]: imageAsset}));
      handleInputChange(id, asset.uri); // Mostra preview com URI local
    }
  }
};

const pickThumbnail = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 1,
    selectionLimit: 1,
  });

  if (result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    if (asset.uri) {
      const thumbnailAsset = {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        fileName: asset.fileName || `thumbnail_${Date.now()}.jpg`,
      };
      
      setTemporaryThumbnail(thumbnailAsset);
      setFormData(prev => ({...prev, thumbnailUri: asset.uri})); // Mostra preview com URI local
    }
  }
};

  const generatePreviewJSON = async () => {
    const thumbnail = await AsyncStorage.getItem("thumbnailUri");

    const blocks = await Promise.all(
      formData.dynamicInputs.map(async (input, index) => {
        const mediaUri = await AsyncStorage.getItem(`media_${input.id}`);
        return {
          type: input.type,
          content: mediaUri || input.content,
          caption: input.caption || '',
          order: index + 1,
        };
      })
    );

    const data = {
      authors: formData.reporters,
      blocks,
      createdAt: new Date().toISOString(),
      description: formData.textDraft,
      feedTitle: formData.articleTitle,
      hashtags: formData.articleTags,
      mainTitle: formData.articleTitle,
      published: false,
      thumbnail:
        thumbnail ||
        formData.dynamicInputs.find((block) => block.type === "image")
          ?.content ||
        "",
    };

    return data;
  };

  const generateJSON = () => {
    const data = {
      authors: formData.reporters,
      blocks: formData.dynamicInputs.map((input, index) => ({
        type: input.type,
        content: input.content,
        caption: input.caption || '',
        order: index + 1,
      })),
      createdAt: new Date().toISOString(),
      description: formData.textDraft,
      feedTitle: formData.articleTitle,
      hashtags: formData.articleTags,
      mainTitle: formData.articleTitle,
      published: false,
      thumbnail:
        formData.thumbnailUri ||
        formData.dynamicInputs.find((block) => block.type === "image")
          ?.content ||
        "",
    };

    return data;
  };

  const handlePreview = async () => {
    const jsonData = await generatePreviewJSON();
    router.push({
      pathname: "/previewPage",
      params: { previewData: JSON.stringify(jsonData), timestamp: Date.now() },
    });
  };

const handleSubmit = async () => {
  setIsLoading(true);
  
  try {
    // Fazer upload de todas as imagens
    const { urls, allSuccess } = await uploadImagesToImgur();
    
    if (!allSuccess) {
      Alert.alert(
        'Aviso', 
        'Algumas imagens não puderam ser enviadas para os servidores. A notícia será salva, mas algumas imagens podem não aparecer corretamente.',
        [{ text: 'Entendi', onPress: () => {} }]
      );
    }
    
    // Atualizar os URLs no formData
    const updatedDynamicInputs = formData.dynamicInputs.map(input => {
      if (input.type === 'image' && urls[input.id]) {
        return {
          ...input,
          content: urls[input.id].url
        };
      }
      return input;
    });
    
    const finalThumbnailUri = urls.thumbnail?.url || formData.thumbnailUri;
    
    // Criar o objeto final para o Firebase
    const jsonData = {
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

    // Enviar para o Firebase
    await addDoc(collection(db, "news"), jsonData);
    
    // Limpar o estado
    resetFormData();
    setTemporaryImages({});
    setTemporaryThumbnail(null);
    
    // Navegar para a página de confirmação
    router.push("/confirmationPage");
  } catch (error) {
    console.error("Submission error:", error);
    Alert.alert("Erro", "Não foi possível enviar a notícia.");
  } finally {
    setIsLoading(false);
  }
};

  const handleSaveOrSubmit = async () => {
    if (parsedNewsData) {
      await handleUpdate();
    } else {
      await handleSubmit();
    }
  };

  const handleUpdate = async () => {
    if (!parsedNewsData?.id) return;

    const updatedData = {
      authors: formData.reporters,
      blocks: formData.dynamicInputs,
      description: formData.textDraft,
      feedTitle: formData.articleTitle,
      hashtags: formData.articleTags,
      mainTitle: formData.articleTitle,
      thumbnail: formData.thumbnailUri || "",
      published: parsedNewsData.published,
      createdAt: parsedNewsData.createdAt,
    };

    try {
      const newsRef = doc(db, "news", parsedNewsData.id);
      await updateDoc(newsRef, updatedData);
      Alert.alert("Sucesso", "Notícia atualizada com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar a notícia.");
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
          <Text style={styles.label}>Thumbnail</Text>
          <TouchableOpacity
            onPress={pickThumbnail}
            style={styles.thumbnailButton}
          >
            {formData.thumbnailUri ? (
              <Image
                source={{ uri: formData.thumbnailUri }}
                style={styles.thumbnailImage}
              />
            ) : (
              <View style={styles.uploadIconContainer}>
                <MaterialIcons name="cloud-upload" size={40} color="#fff" />
                <Text style={styles.thumbnailButtonText}>
                  Faça o upload da thumbnail
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
          handleReporterChange={handleReporterChange}
          reporterName={reporterName}
          handleRemoveReporter={handleRemoveReporter}
          articleTags={formData.articleTags}
          articleTag={articleTag}
          handleTagsChange={handleTagsChange}
          handleRemoveTag={handleRemoveTag}
        />

        {/* Inputs dinâmicos */}
        {formData.dynamicInputs.map((input) => (
          <View key={input.id} style={styles.dynamicInputContainer}>
            {input.type === "image" ? (
              <View style={styles.mediaContainer}>
                {input.content ? (
                  <>
                    <Image
                      source={{ uri: input.content }}
                      style={styles.mediaPreview}
                    />
                    <TextInput
                      style={styles.captionInput}
                      placeholder="Legenda da imagem (opcional)"
                      value={input.caption || ''}
                      onChangeText={(text) => handleInputChange(input.id, input.content, text)}
                    />
                    <View style={styles.mediaActions}>
                      <TouchableOpacity
                        onPress={() => pickImage(input.id)}
                        style={styles.editMediaButton}
                      >
                        <Text style={styles.editMediaButtonText}>Alterar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveInput(input.id)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => pickImage(input.id)}
                    style={styles.mediaButton}
                  >
                    <View style={styles.uploadIconContainer}>
                      <MaterialIcons name="cloud-upload" size={40} color="#fff" />
                      <Text style={styles.mediaButtonText}>
                        Upload de Imagem
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ) : input.type === "video" ? (
              <View style={styles.videoLinkContainer}>
                <TextInput
                  style={styles.videoLinkInput}
                  placeholder="Cole o link do vídeo (YouTube, Vimeo, etc.)"
                  value={input.content}
                  onChangeText={(text) => handleInputChange(input.id, text)}
                />
                {input.content && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(input.content)}
                    style={styles.previewLinkButton}
                  >
                    <Text style={styles.previewLinkText}>Visualizar vídeo</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleRemoveInput(input.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remover vídeo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                style={styles.dynamicInput}
                placeholder={`Digite o ${input.type === "text" ? "texto" : "tópico"}`}
                value={input.content}
                onChangeText={(text) => handleInputChange(input.id, text)}
                multiline
              />
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.addInputButton}
          onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        >
          <Text style={styles.addInputButtonText}>+ Adicionar novo campo</Text>
        </TouchableOpacity>

        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            {Object.keys(typeMapping).map((key) => {
              const friendlyType = key as FriendlyType;
              return (
                <TouchableOpacity
                  key={friendlyType}
                  onPress={() => handleAddInput(friendlyType)}
                >
                  <Text style={styles.dropdownOption}>{friendlyType}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  thumbnailButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    backgroundColor: standard.colors.campusRed,
  },
  thumbnailButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  uploadIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  dynamicInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dynamicInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    fontSize: 16,
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
  dropdownMenu: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  dropdownOption: {
    fontSize: 16,
    paddingVertical: 8,
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
  mediaButton: {
    width: "100%",
    backgroundColor: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 110,
  },
  mediaButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  mediaContainer: {
    marginBottom: 16,
    width: "100%"
  },
  mediaPreview: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mediaActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editMediaButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  editMediaButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 14,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  removeButtonText: {
    color: standard.colors.primaryWhite,
    fontWeight: "bold",
    fontSize: 14,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 16,
  },
  videoLinkContainer: {
    width: '100%',
    marginBottom: 16,
  },
  videoLinkInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  previewLinkButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLinkText: {
    color: standard.colors.primaryWhite,
    fontWeight: 'bold',
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
