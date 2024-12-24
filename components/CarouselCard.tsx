import { Linking, StyleSheet, Image, View, Dimensions, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const {width} = Dimensions.get('window')

const CarouselCard = ({ item }) => {
  const videoLink = `https://www.youtube.com/watch?v=${item.id.videoId}`

  const goToVideo = async () => {
    if (videoLink) {
      const supported = await Linking.canOpenURL(videoLink);
      if (supported) {
        await Linking.openURL(videoLink);
      } else {
        console.error(`Não é possível abrir o link: ${item.link}`);
      }
    }
};

  return (
    <TouchableOpacity style={styles.container} onPress={goToVideo}>
      
      <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
        style={styles.gradient}
      />
    </TouchableOpacity>
  )
}

export default CarouselCard

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        width: width*0.8-20,
        height: width/2.6,
        marginHorizontal:10,
        borderRadius: 12,
    },
    gradient: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 0,
        height: width / 2.6,
        borderRadius: 12,
      },
})