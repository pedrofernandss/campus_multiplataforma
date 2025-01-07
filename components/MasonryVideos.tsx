import React, { useEffect, useState } from 'react'
import MasonryList from '@react-native-seoul/masonry-list';
import { StyleSheet, Text, View } from 'react-native'
import MasonryCard from './MasonryCard';
import { types } from '@/constants';
import { fetchInstagramMedia } from '@/functions/instagramFunctions';


const MasonryVideos = () => {
  const [reels, setReels] = useState<types.InstagramReels[]>([]);
  useEffect(() => {
    const loadReels = async () => {
        try {
            const fetchedReels = await fetchInstagramMedia();
            setReels(fetchedReels);
        } catch (error) {
            console.error("Erro ao buscar os reels: ", error);
        }
    };

    loadReels();
  }, []);
  
  return (
    <MasonryList
        data={reels} 
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
    paddingHorizontal: 8,
  }
})
