import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { News } from "../types/news";
import ArticleCard from "./ArticleCard";
import standard from "../theme";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { icons } from "../constants";

const ArticleList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false)

  const fetchArticles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "news"));
      const allNews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as News[];

      const sortedNews = allNews.sort(
        (a, b) => Number(a.published) - Number(b.published)
      );
      setNews(sortedNews);

      const published = allNews.filter(
        (item) => item.published === true
      ).length;
      setPublishedCount(published);
      setPendingCount(allNews.length - published);
    } catch (error) {
      console.error("Erro ao buscar textos:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "news"), (snapshot) => {
      try {
        const allNews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as News[];

        const sortedNews = allNews.sort(
          (a, b) => Number(a.published) - Number(b.published)
        );
        setNews(sortedNews);

        const published = allNews.filter(
          (item) => item.published === true
        ).length;
        setPublishedCount(published);
        setPendingCount(allNews.length - published);
      } catch (error) {
        console.error("Erro ao buscar textos:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Image source={icons.taskIcon} style={styles.icon} />
          </View>
          <View style={styles.statCardContainer}>
            <Text style={styles.statTitle} numberOfLines={1} ellipsizeMode="tail">Textos Postados</Text>
            <Text style={styles.statValue}>{publishedCount}</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Image source={icons.timerIcon} style={styles.icon} />
          </View>
          <View style={styles.statCardContainer}>
            <Text style={styles.statTitle}>Pendentes</Text>
            <Text style={styles.statValue}>{pendingCount}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.titleStyle}>Lista de textos pendentes</Text>
      <FlatList
        data={news}
        keyExtractor={(news) => news.id.toString()}
        renderItem={({ item }) => (
          <ArticleCard news={item} onActionComplete={fetchArticles} />)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

export default ArticleList;

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
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
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  statCardContainer: {
    paddingLeft: 5,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: standard.fonts.regular,
    color: standard.colors.black,
    marginBottom: -12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: standard.fonts.bold,
    color: standard.colors.black,
  },
  flatListContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleStyle: {
    marginTop: 8,
    marginLeft: 20,
    fontFamily: standard.fonts.semiBold,
    fontSize: 20,
  },
});
