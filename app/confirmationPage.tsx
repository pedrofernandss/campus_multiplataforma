import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import standard from "../theme";

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Seu texto foi submetido para aprovação do editor responsável
      </Text>
      <View style={styles.iconContainer}>
        <Image
          source={require("../assets/icons/check-icon-red.png")}
          style={styles.icon}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/writeNewsPage")}
      >
        <Text style={styles.buttonText}>Submeter novo texto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/")}
      >
        <Text style={styles.secondaryButtonText}>Ir para Tela Inicial</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: standard.colors.primaryWhite,
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: standard.colors.black,
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    width: 200,
    height: 200,
    tintColor: standard.colors.campusRed,
  },
  button: {
    backgroundColor: standard.colors.primaryWhite,
    color: standard.colors.campusRed,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "75%",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: standard.colors.campusRed,
  },
  buttonText: {
    color: standard.colors.campusRed,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: standard.colors.primaryWhite,
    fontSize: 16,
    fontWeight: "bold",
  }
});