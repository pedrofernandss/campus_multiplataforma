import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, SafeAreaView, Platform, StatusBar, Dimensions, Alert } from "react-native";
import { useRouter } from "expo-router";
import CardsSection from "@/components/CardSection";
import HeaderEditor from "@/components/HeaderEditor";
import FixedInputs from "@/components/FixedInputs";
import standard from "@/theme";
import { db } from "@/firebase.config";
import { collection, addDoc } from "firebase/firestore";


const { width } = Dimensions.get("window");

export default function newsForm() {
  const router = useRouter();
  const [articleTag, setArticleTag] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [textDraft, setTextDraft] = useState("");
  const [reporters, setReporters] = useState<string[]>([]);
  const [articleTags, setArticleTags] = useState<string[]>([]);
  const [dynamicInputs, setDynamicInputs] = useState<any[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // conversao do tipo front-friendly para o tecnico do firebase
  const typeMapping = {
    Tópico: "subheading",
    Texto: "text",
    Imagem: "image",
    Áudio: "audio",
    Vídeo: "video",
  } as const;
  
  type FriendlyType = keyof typeof typeMapping;

  const handleAddInput = (friendlyType: FriendlyType) => {
    const technicalType = typeMapping[friendlyType];
    setDynamicInputs((prev) => [...prev, { id: Date.now(), type: technicalType, value: "" }]);
    setIsDropdownVisible(false);
  };
  

  const handleRemoveInput = (id: number) => {
    setDynamicInputs((prev) => prev.filter((input) => input.id !== id));
  };

  const handleInputChange = (id: number, value: string) => {
    setDynamicInputs((prev) =>
      prev.map((input) => (input.id === id ? { ...input, value } : input))
    );
  };
  

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
  
  // json gerado para o preview e para a publicacao
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
      thumbnail: dynamicInputs.find((block) => block.type === "image")?.content || "",
    };
  
    //console.log("Generated JSON: ", data); // Debug
    return data;
  };
  

  const handlePreview = () => {
    const jsonData = generateJSON();
    router.push({
      pathname: "/previewPage",
      params: { previewData: JSON.stringify(jsonData), timestamp: Date.now()  },
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
      <HeaderEditor/>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CardsSection />
    
        <Text style={styles.title}>Informações do artigo</Text>
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

        {/*Inputs dinamicos*/}
        {dynamicInputs.map((input) => (
          <View key={input.id} style={styles.dynamicInputContainer}>
            <TextInput style={styles.dynamicInput} placeholder={`Digite o ${input.type}`} value={input.value} onChangeText={(value) => handleInputChange(input.id, value)} multiline />
            <TouchableOpacity onPress={() => handleRemoveInput(input.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addInputButton} onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
          <Text style={styles.addInputButtonText}>+ Adicionar novo campo</Text>
        </TouchableOpacity>

        {/*Dropdown inputs dinamicos*/}
        {isDropdownVisible && (
          <View style={styles.dropdownMenu}>
            {Object.keys(typeMapping).map((key) => {
              const friendlyType = key as FriendlyType; // garantindo o tipo correto
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
  headerContainer: {
    backgroundColor: standard.colors.campusRed,
  },
  headerStyle: {
    paddingHorizontal: "4%",
    width: "100%",
    height: width * 0.145 + (Platform.OS === "android" ? StatusBar.currentHeight : 0),
    backgroundColor: standard.colors.campusRed,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 145,
    height: 31,
  },
  icon: {
    transform: [{ rotate: "180deg" }],
    width: 35,
    height: 35,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dynamicInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    borderRadius: 4,
    marginLeft: 8,
    padding: 4,
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
});