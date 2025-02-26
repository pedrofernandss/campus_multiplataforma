import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../firebase.config";
import { WebView } from "react-native-webview";
import { images, icons } from "../constants";
import standard from "../theme";
import { useFonts } from "expo-font";
import { getAuth } from "firebase/auth";
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";
import ArticleList from "../components/ArticleList";

const { width } = Dimensions.get("window");

export default function EditorPanel() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [articleData, setArticleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Rowdies-Bold": require("../assets/fonts/Rowdies-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header />
        <ArticleList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: standard.colors.primaryWhite,
  },
  headerStyle: {
    paddingHorizontal: "4%",
    width: "100%",
    height:
      width * 0.145 + (Platform.OS === "android" ? StatusBar.currentHeight : 0),
    backgroundColor: standard.colors.campusRed,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: 6,
    width: 145,
    height: 31,
  },
  icon: {
    transform: [{ rotate: "180deg" }],
    width: 35,
    height: 35,
  },
  subheading: {
    fontSize: 20,
    color: standard.colors.campusRed,
    marginBottom: 8,
    textAlign: "left",
    fontFamily: "Rowdies-Bold",
  },
  contentContainer: {
    padding: 12,
  },
  mainTitle: {
    fontSize: 20,
    marginBottom: 3,
    textAlign: "justify",
    color: standard.colors.black,
    fontFamily: "Quicksand-Bold",
  },
  blockContainer: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  caption: {
    fontSize: 12,
    color: standard.colors.grey,
    marginBottom: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 1,
    textAlign: "justify",
    color: "#333",
    fontFamily: "Quicksand-Semibold",
  },
  authors: {
    fontSize: 14,
    color: standard.colors.grey,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  webview: {
    height: 50,
    width: "100%",
  },
  video: {
    height: 200,
    width: width,
    backgroundColor: "#000",
  },
  boldText: {
    fontWeight: "bold",
  },
});
