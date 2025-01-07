import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import NewsCard from './NewsCard';
import { types } from '@/constants';
import { fetchNews } from '@/functions/newsFunctions';

const { width } = Dimensions.get('window');

const NewsList = () => {
  const [news, setNews] = useState<types.News[]>([]);
  
  useEffect(() => {
      const loadNews = async () => {
          try {
              const fetchedNews = await fetchNews();
              setNews(fetchedNews);
          } catch (error) {
              console.error("Erro ao buscar as notícias: ", error);
          }
      };

      loadNews();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={news}
        keyExtractor={(news) => news.id.toString()}
        renderItem={({ item }) => <NewsCard news={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
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
