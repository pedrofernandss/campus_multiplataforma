import { Linking, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'



const MasonryCard = ({ item }) => {
    
    const handlePress = async () => {
        if (item.link) {
          const supported = await Linking.canOpenURL(item.link);
          if (supported) {
            await Linking.openURL(item.link);
          } else {
            console.error(`Não é possível abrir o link: ${item.link}`);
          }
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Image
            source={item.image}
            style={[styles.image, { aspectRatio: item.aspectRatio}]}
            resizeMode="cover"
        />
        </TouchableOpacity>
    )
}

export default MasonryCard

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: undefined,
        borderRadius: 12,
    },
})