import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from 'axios';
import CardsSection from "@/components/CardSection";
import HeaderEditor from "@/components/HeaderEditor";
import FixedInputs from "@/components/FixedInputs";
import standard from "@/theme";
import { db } from "@/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");


export default function NewsForm() {
  const router = useRouter();
  const [articleTag, setArticleTag] = useState(""); 
  const [reporterName, setReporterName] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [textDraft, setTextDraft] = useState("");
  const [reporters, setReporters] = useState<string[]>([]);
  const [articleTags, setArticleTags] = useState<string[]>([]);
  const [dynamicInputs, setDynamicInputs] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  const typeMapping = {
    Tópico: "subheading",
    Texto: "text",
    Imagem: "image",
    Vídeo: "video",
  } as const;

  type FriendlyType = keyof typeof typeMapping;

  // Cache de mídia
  useEffect(() => {
    const loadMedia = async () => {
      const thumbnail = await AsyncStorage.getItem('thumbnailUri');
      if (thumbnail) {
        setThumbnailUri(thumbnail);
      }

      const loadedInputs = await Promise.all(
        dynamicInputs.map(async (input) => {
          const mediaUri = await AsyncStorage.getItem(`media_${input.id}`);
          return mediaUri ? { ...input, value: mediaUri } : input;
        })
      );

      setDynamicInputs(loadedInputs);
    };

    loadMedia();
  }, []);

  // Manipulação dos inputs
  const handleAddInput = (friendlyType: FriendlyType) => {
    const technicalType = typeMapping[friendlyType];
    setDynamicInputs((prev) => [...prev, { id: Date.now(), type: technicalType, value: "" }]);
    setIsDropdownVisible(false);
  };

  const handleRemoveInput = async (id: number) => {
    setDynamicInputs((prev) => prev.filter((input) => input.id !== id));
  };

  const handleInputChange = (id: number, value: string) => {
    setDynamicInputs((prev) =>
      prev.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };

  // Manipulação das tags
  const handleReporterChange = (text: string) => {
    if (text.endsWith(",")) {
      const names = text.split(",").map((name) => name.trim()).filter(Boolean);
      setReporters((prev) => [...prev, ...names]);
      setReporterName("");
    } else {
      setReporterName(text);
    }
  };

  const handleRemoveReporter = (index: number) => {
    setReporters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveTag = (index: number) => {
    setArticleTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagsChange = (text: string) => {
    if (text.endsWith(" ")) {
      const tags = text.split(" ").map((tag) => tag.trim()).filter(Boolean);
      setArticleTags((prev) => [...prev, ...tags.map((tag) => `#${tag}`)]);
      setArticleTag("");
    } else {
      setArticleTag(text);
    }
  };

  // Upload de imagens para o Imgur
  const uploadImageToImgur = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await axios.post('https://api.imgur.com/3/image', formData, {
        headers: {
          'Authorization': `Client-ID ${process.env.EXPO_PUBLIC_CLIENT_ID}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.link;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return null;
    }
  };

  const pickMedia = async (id: number, type: 'image' | 'video') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria de mídias.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (type === 'image') {
        const imgurUrl = await uploadImageToImgur(uri);
        if (imgurUrl) {
          handleInputChange(id, imgurUrl);
          await AsyncStorage.setItem(`media_${id}`, imgurUrl);
        }
      } else if (type === 'video') {
        handleInputChange(id, uri);
        await AsyncStorage.setItem(`media_${id}`, uri);
      }
    }
  };

  // Thumbnail
  const pickThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria de imagens.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const imgurUrl = await uploadImageToImgur(uri);
      if (imgurUrl) {
        setThumbnailUri(imgurUrl);
        await AsyncStorage.setItem('thumbnailUri', imgurUrl);
      }
    }
  };

  // Geração do JSON padronizado para pré-visualização
  const generatePreviewJSON = async () => {
    const thumbnail = await AsyncStorage.getItem('thumbnailUri');

    const blocks = await Promise.all(
      dynamicInputs.map(async (input, index) => {
        const mediaUri = await AsyncStorage.getItem(`media_${input.id}`);
        return {
          type: input.type,
          content: mediaUri || input.value,
          order: index + 1,
        };
      })
    );

    const data = {
      authors: reporters,
      blocks,
      createdAt: new Date().toISOString(),
      description: textDraft,
      feedTitle: articleTitle,
      hashtags: articleTags,
      mainTitle: articleTitle,
      published: false,
      thumbnail: thumbnail || dynamicInputs.find((block) => block.type === "image")?.content || "",
    };

    return data;
  };

  // Geração do JSON padronizado para publicação
  const generateJSON = () => {
    const data = {
      authors: reporters,
      blocks: dynamicInputs.map((input, index) => ({
        type: input.type,
        content: input.value,
        order: index + 1,
      })),
      createdAt: new Date().toISOString(),
      description: textDraft,
      feedTitle: articleTitle,
      hashtags: articleTags,
      mainTitle: articleTitle,
      published: false,
      thumbnail: thumbnailUri || dynamicInputs.find((block) => block.type === "image")?.content || "",
    };

    return data;
  };

  // Funções para pré-visualização e envio
  const handlePreview = async () => {
    const jsonData = await generatePreviewJSON();
    router.push({
      pathname: "/previewPage",
      params: { previewData: JSON.stringify(jsonData), timestamp: Date.now() },
    });
  };

  const handleSubmit = async () => {
    const jsonData = generateJSON();
    Alert.alert("Confirmar Publicação", "Deseja enviar este artigo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Enviar",
        onPress: async () => {
          try {
            await addDoc(collection(db, "articles"), jsonData);
            Alert.alert("Sucesso", "Artigo publicado com sucesso!");
            router.back();
          } catch {
            Alert.alert("Erro", "Não foi possível enviar o artigo.");
          }
        },
      },
    ]);
  };

  
  return (
    <View style={styles.container}>
      <HeaderEditor />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CardsSection /> 

        <Text style={styles.title}>Informações do artigo</Text>
        <View style={styles.thumbnailContainer}>
          <Text style={styles.label}>Thumbnail</Text>
          <TouchableOpacity onPress={pickThumbnail} style={styles.thumbnailButton}>
            {thumbnailUri ? (
              <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} />
            ) : (
              <Text style={styles.thumbnailButtonText}>Selecionar Thumbnail</Text>
            )}
          </TouchableOpacity>
        </View>

        <FixedInputs
          articleTitle={articleTitle}
          setArticleTitle={setArticleTitle}
          textDraft={textDraft}
          setTextDraft={setTextDraft}
          reporters={reporters}
          handleReporterChange={handleReporterChange}
          reporterName={reporterName}
          handleRemoveReporter={handleRemoveReporter}
          articleTags={articleTags}
          articleTag={articleTag}
          handleTagsChange={handleTagsChange}
          handleRemoveTag={handleRemoveTag}
        />

        {/* Inputs dinâmicos */}
        {dynamicInputs.map((input) => (
          <View key={input.id} style={styles.dynamicInputContainer}>
            {input.type === 'image' || input.type === 'video' ? (
              input.value ? (
                <Image source={{ uri: input.value }} style={styles.mediaPreview} />
              ) : (
                <TouchableOpacity onPress={() => pickMedia(input.id, input.type)} style={styles.mediaButton}>
                  <View style={styles.uploadIconContainer}>
                    <MaterialIcons name="cloud-upload" size={40} color="#fff" />
                    <Text style={styles.mediaButtonText}>Upload {input.type === 'image' ? 'Imagem' : 'Vídeo'}</Text>
                  </View>
                </TouchableOpacity>
              )
            ) : (
              <TextInput
                style={styles.dynamicInput}
                placeholder={`Digite o ${input.type === 'text' ? 'texto' : input.type === 'subheading' ? 'tópico' : '' }`}
                value={input.value}
                onChangeText={(value) => handleInputChange(input.id, value)}
                multiline
              />
            )}
            <TouchableOpacity onPress={() => handleRemoveInput(input.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addInputButton} onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          <Text style={styles.addInputButtonText}>+ Adicionar novo campo</Text>
        </TouchableOpacity>                

        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            {Object.keys(typeMapping).map((key) => {
              const friendlyType = key as FriendlyType;
              return (
                <TouchableOpacity key={friendlyType} onPress={() => handleAddInput(friendlyType)}>
                  <Text style={styles.dropdownOption}>{friendlyType}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}


        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.previewButton]} onPress={handlePreview}>
            <Text style={styles.previewText}>Pré-visualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.submitText}>Enviar</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
  },
  thumbnailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
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
    width: width * 0.85,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: standard.colors.campusRed,
    borderRadius: 4,
    marginLeft: 8,
    padding: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
    color: "#fff",
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
    backgroundColor: "#ccc",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: standard.colors.campusRed,
    marginLeft: 8,
  },
  previewText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mediaButton: {
    width: width * 0.85,
    backgroundColor: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
  },
  mediaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  mediaPreview: {
    width: width * 0.85,
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});