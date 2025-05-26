import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import standard from '../theme';

type BlockType = 'Tópico' | 'Texto' | 'Imagem' | 'Vídeo';

interface AddBlockMenuProps {
  onSelect: (type: BlockType) => void;
  visible: boolean;
}

export const AddBlockMenu: React.FC<AddBlockMenuProps> = ({
  onSelect,
  visible,
}) => {
  if (!visible) return null;

  const blockTypes: BlockType[] = ['Tópico', 'Texto', 'Imagem', 'Vídeo'];

  return (
    <View style={styles.container}>
      {blockTypes.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => onSelect(type)}
          style={styles.option}
        >
          <Text style={styles.optionText}>{type}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  option: {
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
  },
}); 