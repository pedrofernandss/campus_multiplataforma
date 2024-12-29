import React from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import newsData from '@/assets/mocked-data/news';
import NewsCard from './NewsCard';

const { width } = Dimensions.get('window');

const NewsList = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={newsData}
        renderItem={({ item }) => <NewsCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: 10, 
  },
});
