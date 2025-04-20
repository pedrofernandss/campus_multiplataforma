import Trendings from "../components/Trendings";
import Header from "../components/Header";
import { StatusBar } from "expo-status-bar";
import standard from "../theme";
import Carousel from "../components/Carousel";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";
import MasonryVideos from "../components/MasonryVideos";

export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={standard.colors.primaryWhite} style="dark" />
      <Header />
      <Trendings />
      <Carousel />
      <MasonryVideos />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: standard.colors.primaryWhite,
    flex: 1,
  },
});