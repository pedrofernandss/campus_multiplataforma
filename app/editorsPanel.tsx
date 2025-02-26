import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import standard from "../theme";
import Header from "../components/Header";
import ArticleList from "../components/ArticleList";

const { width } = Dimensions.get("window");

export default function EditorPanel() {
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
    width: 30,
    height: 30,
  },
  subheading: {
    fontSize: 20,
    color: standard.colors.campusRed,
    marginBottom: 8,
    textAlign: "left",
    fontFamily: standard.fonts.semiBold,
  },
  contentContainer: {
    padding: 12,
  },
  mainTitle: {
    fontSize: 20,
    marginBottom: 3,
    textAlign: "justify",
    color: standard.colors.black,
    fontFamily: standard.fonts.bold,
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
    fontFamily: standard.fonts.semiBold,
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
