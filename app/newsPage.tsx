import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Platform, StatusBar, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { WebView } from "react-native-webview";
import { images, icons } from "../constants";
import standard from "@/theme";
import { useFonts } from "expo-font";

const { width } = Dimensions.get('window');

export default function NewsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [newsData, setNewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'Rowdies-Bold': require('../assets/fonts/Rowdies-Bold.ttf'),
  });

  useEffect(() => {
    const fetchNewsById = async () => {
      try {
        const docRef = doc(db, "news", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNewsData(docSnap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNewsById();
  }, [id]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!newsData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Notícia não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: styles.headerStyle.backgroundColor }}>
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={icons.arrowFowardIcon} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={images.logo} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.mainTitle}>{newsData.mainTitle}</Text>
        <Text style={styles.authors}>
          <Text style={styles.boldText}>Por: </Text>
          {newsData.authors.join(", ")} {"\n"}
          {new Date(newsData.createdAt).toLocaleDateString()}
        </Text>

        {newsData.blocks
          .sort((a: any, b: any) => a.order - b.order)
          .map((block: any, index: number) => {
            switch (block.type) {
              case "image":
                const processedUri =
                  block.content.includes("imgur.com") && !block.content.endsWith(".jpg")
                    ? block.content + ".jpg"
                    : block.content;
                return (
                  <View key={index} style={styles.blockContainer}>
                    <Image source={{ uri: processedUri }} style={styles.image} />
                    {block.caption && <Text style={styles.caption}>{block.caption}</Text>}
                  </View>
                );
              case "text":
                return (
                  <View key={index} style={styles.blockContainer}>
                    <Text style={styles.text}>{block.content}</Text>
                  </View>
                );
              case "audio":
                return (
                  <View key={index} style={styles.blockContainer}>
                    <WebView
                      source={{ html: block.content }}
                      style={styles.webview}
                      javaScriptEnabled
                      allowsInlineMediaPlayback
                    />
                  </View>
                );
              case "video":
                return (
                  <View key={index} style={styles.blockContainer}>
                    <WebView
                      source={{ uri: block.content }}
                      style={styles.video}
                      javaScriptEnabled
                      allowsInlineMediaPlayback
                    />
                    {block.caption && <Text style={styles.caption}>{block.caption}</Text>}
                  </View>
                );
              case "subheading":
                return (
                  <View key={index} style={styles.blockContainer}>
                    <Text style={styles.subheading}>{block.content}</Text>
                  </View>
                );
              default:
                return null;
            }
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerStyle: {
    paddingHorizontal: '4%',
    width: '100%',
    height: width * 0.145 + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
    backgroundColor: standard.colors.campusRed,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: 6,
    width: 145,
    height: 31,
  },
  icon: {
    transform: [{ rotate: '180deg' }],
    width: 35,
    height: 35,
  },
  subheading: {
    fontSize: 20,
    color: standard.colors.campusRed,
    marginBottom: 8,
    textAlign: "left",
    fontFamily: 'Rowdies-Bold',
  },
  contentContainer: {
    padding: 12
  },
  mainTitle: {
    fontSize: 20,
    marginBottom: 3,
    textAlign: 'justify',
    color: standard.colors.black,
    fontFamily: 'Quicksand-Bold',
  },
  blockContainer: {
    marginBottom: 16
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8
  },
  caption: {
    fontSize: 12,
    color: standard.colors.grey,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: "italic"
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 1,
    textAlign: 'justify',
    color: "#333",
    fontFamily: 'Quicksand-Semibold',
  },
  authors: {
    fontSize: 14,
    color: standard.colors.grey,
    marginBottom: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  webview: {
    height: 50,
    width: "100%"
  },
  video: {
    height: 200,
    width: width,
    backgroundColor: "#000"
  },
  boldText: {
    fontWeight: "bold", 
  },
});