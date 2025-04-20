import React, { useEffect, useState } from "react";
import MasonryList from "@react-native-seoul/masonry-list";
import { StyleSheet, Text, View } from "react-native";
import MasonryCard from "./MasonryCard";
import { InstagramReels } from "../types/instagramReels";
import { fetchInstagramMedia } from "../functions/instagramFunctions";

const MasonryVideos = () => {
  const [reels, setReels] = useState<InstagramReels[]>([]);
  useEffect(() => {
    const loadReels = async () => {
      try {
        const fetchedReels = await fetchInstagramMedia();
        setReels(fetchedReels);
      } catch (error) {
        console.error("Erro ao buscar os reels: ", error.response?.data || error.message);
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
  );
};

export default MasonryVideos;

const styles = StyleSheet.create({
  masonry: {
    paddingHorizontal: 8,
  },
});
