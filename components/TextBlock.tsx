import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import standard from '../theme';

interface TextBlockProps {
  id: string;
  content: string;
  type: 'text' | 'subheading';
  onContentChange: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  id,
  content,
  type,
  onContentChange,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          type === 'subheading' && styles.subheadingInput
        ]}
        placeholder={type === 'text' ? 'Digite o texto' : 'Digite o tópico'}
        value={content}
        onChangeText={(text) => onContentChange(id, text)}
        multiline
      />
      <TouchableOpacity
        onPress={() => onRemove(id)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>
          Remover {type === 'text' ? 'texto' : 'tópico'}
        </Text>
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  subheadingInput: {
    minHeight: 50,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: standard.colors.campusRed,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-end',
    minWidth: 100,
  },
  removeButtonText: {
    color: standard.colors.primaryWhite,
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 