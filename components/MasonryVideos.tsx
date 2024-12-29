import React from 'react'
import MasonryList from '@react-native-seoul/masonry-list';
import { StyleSheet, Text, View } from 'react-native'
import MasonryCard from './MasonryCard';
import masonryImages from '@/assets/mocked-data/masonryImages';


const MasonryVideos = () => {
  
  return (
    <MasonryList
        data={masonryImages} 
        renderItem={({ item }) => <MasonryCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.masonry}
        showsVerticalScrollIndicator={false}
        refreshing={false}
    />
  )
}

export default MasonryVideos

const styles = StyleSheet.create({
  masonry: {
    paddingHorizontal: 24,
  }
})
