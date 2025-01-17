import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { icons, images } from "../constants";
import standard from "@/theme";

const HeaderEditor = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={icons.arrowFowardIcon} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: standard.colors.campusRed },
  headerStyle: {
    paddingHorizontal: "4%",
    width: "100%",
    height: 50 + (Platform.OS === "android" ? StatusBar.currentHeight : 0),
    backgroundColor: standard.colors.campusRed,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logoContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  logo: { 
    width: 145, 
    height: 31 
  },
  icon: { 
    transform: [{ rotate: "180deg" }], 
    width: 35, 
    height: 35 
  },
});

export default HeaderEditor;
