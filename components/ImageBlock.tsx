import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { ImageAsset } from '../types/imageTypes';
import { ImageUploadField } from './ImageUploadField';
import standard from '../theme';

interface ImageBlockProps {
  id: string;
  content: string;
  caption?: string;
  onImageSelected: (id: string, imageAsset: ImageAsset) => void;
  onCaptionChange: (id: string, content: string, caption: string) => void;
  onRemove: (id: string) => void;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({
  id,
  content,
  caption,
  onImageSelected,
  onCaptionChange,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <ImageUploadField
        imageUri={content}
        onImageSelected={(imageAsset) => onImageSelected(id, imageAsset)}
      />
      <TextInput
        style={styles.captionInput}
        placeholder="Legenda da imagem (opcional)"
        value={caption}
        onChangeText={(text) => onCaptionChange(id, content, text)}
      />
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onRemove(id)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>Remover imagem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    minWidth: 100,
  },
  removeButtonText: {
    color: standard.colors.primaryWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 