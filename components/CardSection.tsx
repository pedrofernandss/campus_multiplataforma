import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView } from "react-native";
import standard from "../theme";
import { icons } from "../constants";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";

const { width } = Dimensions.get("window");

type CardProps = {
  title: string;
  value: number;
  icon: any;
};

export default function CardsSection() {
  const [artigosPostados, setArtigosPostados] = useState<number>(0);
  const [pendentes, setPendentes] = useState<number>(0);

  const contarDocumentos = async () => {
    try {
      const newsCollection = collection(db, "news");
      const snapshot = await getDocs(newsCollection);
      setArtigosPostados(snapshot.size);
    } catch (error) {
      console.error("Erro ao contar documentos:", error);
    }
  };

  // Simulação de "Pendentes"
  const contarPendentes = async () => {
    try {
      const newsCollection = collection(db, "news");
      const q = query(newsCollection, where("published", "==", false));
      const snapshot = await getDocs(q);
      setPendentes(snapshot.size);
    } catch (error) {
      console.log("Erro ao contar artigos pendentes:", error);
    }
  };

  useEffect(() => {
    contarDocumentos();
    contarPendentes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Image source={icons.taskIcon} style={styles.icon} />
          </View>
          <View style={styles.statCardContainer}>
            <Text style={styles.statTitle} numberOfLines={1} ellipsizeMode="tail">Artigos Postados</Text>
            <Text style={styles.statValue}>{artigosPostados}</Text>
          </View>
        </View>
          <View style={styles.statCard}>
            <View style={styles.iconContainer}>
              <Image source={icons.timerIcon} style={styles.icon} />
            </View>
            <View style={styles.statCardContainer}>
              <Text style={styles.statTitle}>Pendentes</Text>
              <Text style={styles.statValue}>{pendentes}</Text>
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 5,
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
});
