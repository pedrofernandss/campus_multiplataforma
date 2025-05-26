import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { launchImageLibrary } from 'react-native-image-picker';
import { ImageAsset } from '../types/imageTypes';
import standard from '../theme';

interface ImageUploadFieldProps {
  imageUri: string | null;
  onImageSelected: (imageAsset: ImageAsset) => void;
  label?: string;
  height?: number;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  imageUri,
  onImageSelected,
  label = "Imagem",
  height = 160
}) => {
  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        const imageAsset: ImageAsset = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
        };
        onImageSelected(imageAsset);
      }
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        onPress={handleImagePick}
        style={[styles.button, { height }]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.uploadIconContainer}>
            <MaterialIcons name="cloud-upload" size={40} color="#fff" />
            <Text style={styles.buttonText}>
              Faça o upload da imagem
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: standard.colors.campusRed,
  },
  buttonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  uploadIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
}); 