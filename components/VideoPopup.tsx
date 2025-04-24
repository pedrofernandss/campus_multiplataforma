import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import standard from '../theme';
import * as ImagePicker from "expo-image-picker";

interface YouTubeVideoPopupProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  onUpload: (videoUri: string) => Promise<string>;
}

const YouTubeVideoPopup: React.FC<YouTubeVideoPopupProps> = ({
  visible,
  onClose,
  onSelect,
  onUpload,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar sua galeria de vídeos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIsUploading(true);
      try {
        const youtubeLink = await onUpload(result.assets[0].uri);
        onSelect(youtubeLink);
        onClose();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível enviar o vídeo para o YouTube');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color={standard.colors.campusRed} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Adicionar vídeo do YouTube</Text>

          <TextInput
            style={styles.urlInput}
            placeholder="Cole o link do YouTube aqui"
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              if (youtubeUrl) {
                onSelect(youtubeUrl);
                onClose();
              }
            }}
            disabled={!youtubeUrl}
          >
            <Text style={styles.confirmButtonText}>Usar este link</Text>
          </TouchableOpacity>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OU</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadFromGallery}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.uploadButtonText}>Enviar vídeo da galeria</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: standard.colors.primaryWhite,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: standard.colors.campusRed,
    marginBottom: 20,
  },
  urlInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  uploadButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default YouTubeVideoPopup;