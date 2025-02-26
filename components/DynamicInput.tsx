import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface DynamicInputProps {
  id: number;
  type: string;
  value: string;
  onChange: (id: number, value: string) => void;
}

export default function DynamicInput({ id, type, value, onChange }: DynamicInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {type === "subheading"
          ? "Subtítulo"
          : type === "text"
          ? "Texto"
          : type === "image"
          ? "Imagem"
          : type === "audio"
          ? "Áudio"
          : "Vídeo"}
      </Text>
      {type === "subheading" || type === "text" ? (
        <TextInput
          style={[styles.input, type === "text" && styles.multilineInput]}
          placeholder={`Digite o ${type === "subheading" ? "subtítulo" : "texto"}`}
          value={value}
          onChangeText={(text) => onChange(id, text)}
          multiline={type === "text"}
        />
      ) : type === "image" ? (
        <TouchableOpacity style={styles.imageUploadButton}>
          <Text style={styles.imageUploadText}>Carregar imagem</Text>
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={`Insira o URL do ${type}`}
          value={value}
          onChangeText={(text) => onChange(id, text)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: { height: 100 },
  imageUploadButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imageUploadText: { fontSize: 16 },
});
