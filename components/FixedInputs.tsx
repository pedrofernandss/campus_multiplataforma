import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

interface FixedInputsProps {
  articleTitle: string;
  setArticleTitle: (value: string) => void;
  textDraft: string;
  setTextDraft: (value: string) => void;
  reporters: string[];
  handleReporterChange: (value: string) => void;
  reporterName: string;
  handleRemoveReporter: (index: number) => void;
  articleTags: string[];
  articleTag: string;
  handleTagsChange: (value: string) => void;
  handleRemoveTag: (index: number) => void;
}

const FixedInputs: React.FC<FixedInputsProps> = ({
  articleTitle,
  setArticleTitle,
  textDraft,
  setTextDraft,
  reporters,
  handleReporterChange,
  reporterName,
  handleRemoveReporter,
  articleTags,
  articleTag,
  handleTagsChange,
  handleRemoveTag,
}) => {
  return (
    <>
      <Text style={styles.label}>Título do Texto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título"
        value={articleTitle}
        onChangeText={setArticleTitle}
        multiline
      />

      <Text style={styles.label}>Gravata do texto</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a gravata"
        value={textDraft}
        onChangeText={setTextDraft}
        multiline
      />

      <Text style={styles.label}>Nome dos Autores</Text>
      <View style={styles.tagContainer}>
        {reporters.map((name, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{name}</Text>
            <TouchableOpacity onPress={() => handleRemoveReporter(index)}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite os nomes separados por vírgula"
        value={reporterName}
        onChangeText={handleReporterChange}
        multiline
      />

      <Text style={styles.label}>Tags do Texto</Text>
      <View style={styles.tagContainer}>
        {articleTags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite as tags separadas por espaços"
        value={articleTag}
        onChangeText={handleTagsChange}
        multiline
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    marginRight: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FixedInputs;
