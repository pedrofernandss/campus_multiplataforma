import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import standard from '../theme';

interface VideoBlockProps {
  id: string;
  content: string;
  onContentChange: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  id,
  content,
  onContentChange,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cole o link do vídeo (YouTube, Vimeo, etc.)"
        value={content}
        onChangeText={(text) => onContentChange(id, text)}
      />
      {content && (
        <TouchableOpacity
          onPress={() => Linking.openURL(content)}
          style={styles.previewButton}
        >
          <Text style={styles.previewButtonText}>Visualizar vídeo</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => onRemove(id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remover vídeo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  previewButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  previewButtonText: {
    color: standard.colors.primaryWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    alignSelf: 'flex-end',
    minWidth: 100,
  },
  removeButtonText: {
    color: standard.colors.primaryWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 