import MasonryList from '@react-native-seoul/masonry-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { types } from '../constants';
import { fetchInstagramMedia } from '../functions/instagramFunctions';
import MasonryCard from './MasonryCard';


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
