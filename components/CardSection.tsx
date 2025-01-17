import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import standard from "@/theme";
import { icons } from "../constants";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";  

const { width } = Dimensions.get("window");

type CardProps = {
  title: string;
  value: number;
  icon: any;
};

export const InfoCard: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
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
    setPendentes(3); 
  };

  useEffect(() => {
    contarDocumentos(); 
    contarPendentes();   
  }, []);

  return (
    <View style={styles.container}>
      <InfoCard title="Artigos Postados" value={artigosPostados} icon={icons.taskDone} />
      <InfoCard title="Pendentes" value={pendentes} icon={icons.clockEditorPage} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 16, 
  },
  card: {
    flexDirection: "row", 
    width: (width - 24) / 2.4 , 
    backgroundColor: "#fff", 
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 35,
    height: 35,
    backgroundColor: "#F2E8FF", 
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, 
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: standard.colors.campusRed, 
  },
  textContainer: {
    flex: 1, 
  },
  cardTitle: {
    fontSize: 10, 
    color: "#666", 
    fontFamily: "Quicksand-Medium",
    textAlign: "left",
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 14, 
    color: "#000",
    fontWeight: "bold",
    fontFamily: "Rowdies-Bold",
    textAlign: "left",
  },
});
