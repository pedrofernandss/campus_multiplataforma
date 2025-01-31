import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList,Text, SafeAreaView, StyleSheet, View, Image } from 'react-native';
import { News } from '@/types/news';
import ArticleCard from './ArticleCard';
import standard from '@/theme';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config"; // Certifique-se de importar sua instância do Firestore
import { icons } from '@/constants';
import { getAllNews } from '@/functions/newsFunctions';


const ArticleList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  
  
  useEffect(() => {
      const loadNews = async () => {
          try {
            const allNews = await getAllNews();

            setNews(allNews);
            
            const published = allNews.filter((item) => item.published === true).length;
            const pending = allNews.length - published;

            setPublishedCount(published);
            setPendingCount(pending);

          } catch (error) {
              console.error("Erro ao buscar as notícias: ", error);
          }
      };

      loadNews();
  }, []);

 

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.statsContainer}>

        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Image source={icons.taskIcon} style={styles.icon}/>
          </View>
          <View style={styles.statCardContainer}>
            <Text style={styles.statTitle}>Artigos Postados</Text>
            <Text style={styles.statValue}>{publishedCount}</Text> 
          </View>         
        </View>
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Image source={icons.timerIcon} style={styles.icon}/>
          </View>
          <View style={styles.statCardContainer}>
            <Text style={styles.statTitle}>Pendentes</Text>
            <Text style={styles.statValue}>{pendingCount}</Text> 
          </View>         
        </View>
      </View>
      <Text style={styles.titleStyle}>Lista de artigos disponíveis</Text>
      <FlatList
        data={news}
        keyExtractor={(news) => news.id.toString()}
        renderItem={({ item }) => <ArticleCard news={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

export default ArticleList;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: "#383737",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  icon: {
    width: 28, 
    height: 28, 
    resizeMode: 'contain',
  },
  statCardContainer: {
    paddingLeft: 5,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: standard.fonts.regular,
    color: standard.colors.blue,
    marginBottom: 0, 
  },
  statValue: {
    fontSize: 20,
    fontFamily: standard.fonts.bold,
    color: standard.colors.black,
  },
  flatListContainer: {
    // paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  titleStyle: {
    marginTop: 10, 
    marginLeft: 20,
    fontFamily: standard.fonts.semiBold,
    fontSize: 20,
  }
});
