import { Linking, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'



const MasonryCard = ({ item }) => {
    
    const goToReels = async () => {
        if (item.permalink) {
          const supported = await Linking.canOpenURL(item.permalink);
          if (supported) {
            await Linking.openURL(item.permalink);
          } else {
            console.error(`Não é possível abrir o link: ${item.permalink}`);
          }
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={goToReels}>
            <Image
                source={{ uri: item.thumbnail_url }}
                style={[styles.image, { aspectRatio: item.aspect_ratio}]}
                resizeMode="cover"
            />
        </TouchableOpacity>
    )
}

export default MasonryCard

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        // marginBottom: 6,
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