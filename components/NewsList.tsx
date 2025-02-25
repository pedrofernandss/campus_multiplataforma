import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import NewsCard from './NewsCard';
import { fetchNews } from '@/functions/newsFunctions';
import { News } from '@/types/news';
import { db } from '@/firebase.config';
import { collection, onSnapshot } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      setNews(newsData);
    }, (error) => {
      console.error("Erro ao observar as notícias: ", error);
    });

    return () => unsubscribe();
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
