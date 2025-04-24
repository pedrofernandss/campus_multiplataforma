import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, SafeAreaView, StyleSheet } from "react-native";
import NewsCard from "./NewsCard";
import { fetchNews } from "../functions/newsFunctions";
import { News } from "../types/news";

const { width } = Dimensions.get("window");

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [refreshing, setRefreshing] = useState(false)

  const loadNews = async () => {
    try {
      const fetchedNews = await fetchNews();
      setNews(fetchedNews);
    } catch (error) {
      console.error("Erro ao buscar as notícias: ", error);
    }
  };

  useEffect(() => {
    loadNews();
  }, [])

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={news}
        keyExtractor={(news) => news.id.toString()}
        renderItem={({ item }) => <NewsCard news={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 15,
  },
});
