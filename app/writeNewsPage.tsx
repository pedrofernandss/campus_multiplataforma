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
import { capitalizeWords } from "../functions/textFunctions";

const { width } = Dimensions.get("window");

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

  const [articleTag, setArticleTag] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [videoPopupVisible, setVideoPopupVisible] = useState(false);
  const [currentVideoInputId, setCurrentVideoInputId] = useState<string | null>(null);
  
  const typeMapping = {
    Tópico: "subheading",
    Texto: "text",
    Imagem: "image",
    Vídeo: "video",
  } as const;

  type FriendlyType = keyof typeof typeMapping;

  useEffect(() => {
    if (parsedNewsData) {
      setFormData({
        articleTitle: parsedNewsData.mainTitle,
        textDraft: parsedNewsData.description,
        reporters: parsedNewsData.authors,
        articleTags: parsedNewsData.hashtags,
        dynamicInputs: parsedNewsData.blocks,
        thumbnailUri: parsedNewsData.thumbnail,
      });
    }
  }, [parsedNewsData]);

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

  const uploadImageToImgur = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const response = await axios.post(
        "https://api.imgur.com/3/image",
        formData,
        {
          headers: {
            Authorization: `Client-ID ${process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data.link;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return null;
    }
  };

  const pickImage = async (id: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar sua galeria de imagens."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const imgurUrl = await uploadImageToImgur(uri);
      if (imgurUrl) {
        handleInputChange(id, imgurUrl);
        await AsyncStorage.setItem(`media_${id}`, imgurUrl);
      }
    }
  };

  const pickThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da permissão para acessar sua galeria de imagens."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const imgurUrl = await uploadImageToImgur(uri);
      if (imgurUrl) {
        setFormData((prev) => ({
          ...prev,
          thumbnailUri: imgurUrl,
        }));
        await AsyncStorage.setItem("thumbnailUri", imgurUrl);
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
    const jsonData = generateJSON();
    try {
      await addDoc(collection(db, "news"), jsonData);
      setFormData({
        articleTitle: "",
        textDraft: "",
        reporters: [],
        articleTags: [],
        dynamicInputs: [],
        thumbnailUri: null,
      });
      router.push("/confirmationPage");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar o artigo.");
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

        <Text style={styles.title}>Informações do artigo</Text>
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
            setFormData((prev) => ({ ...prev, articleTitle: capitalizeWords(value) }))
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
    fontSize: 16,
  },
  submitText: {
    color: standard.colors.primaryWhite,
    fontWeight: "bold",
    fontSize: 16,
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
});
