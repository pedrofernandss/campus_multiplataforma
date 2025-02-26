import Trendings from "../components/Trendings";
import Header from "../components/Header";
import { StatusBar } from "expo-status-bar";
import standard from "../theme";
import Carousel from "../components/Carousel";
import NewsList from "../components/NewsList";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar backgroundColor={standard.colors.primaryWhite} style="dark" />
      <Header />
      <Trendings />
      <Carousel />
      <NewsList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: standard.colors.primaryWhite,
    flex: 1,
  },
});
