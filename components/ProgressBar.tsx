import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { deleteNews, updateNewsStatus } from "../functions/newsFunctions";
import standard from "../theme";
import { News } from "../types";
import { ProgressBox } from "../types/progressBar";
import { useRouter } from "expo-router";

const ProgressBar: React.FC<ProgressBox> = ({
  newsId,
  label,
  isOpen,
  onClose,
  type,
}) => {
  const totalTime = 3; // Tempo total em segundos
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Executa a ação (aprovar ou deletar) assim que o modal abre
      const executeAction = async () => {
        try {
          if (type === "approve") {
            await updateNewsStatus(newsId, true);
          } else if (type === "delete") {
            await deleteNews(newsId);
          }
        } catch (error) {
          console.error(
            `Erro ao ${
              type === "approve" ? "atualizar" : "remover"
            } a notícia:`,
            error
          );
        }
      };
      executeAction();

      // Reseta o valor animado
      animatedProgress.setValue(0);

      // Adiciona um listener para atualizar o texto de progresso e tempo restante
      const listenerId = animatedProgress.addListener(({ value }) => {
        setProgress(value);
        setTimeLeft(Math.round(totalTime - (value / 100) * totalTime));
      });

      // Anima a barra de progresso de 0 a 100 de forma suave durante totalTime segundos
      Animated.timing(animatedProgress, {
        toValue: 100,
        duration: totalTime * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        animatedProgress.removeListener(listenerId);
        onClose && onClose(); // Fecha o modal após a animação completa
      });
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.progressHeader}>
              <Text style={styles.percentage}>{Math.round(progress)}%</Text>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.timeLeft}>{timeLeft}s left</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progress,
                  {
                    width: animatedProgress.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "85%",
    backgroundColor: standard.colors.primaryWhite,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 15,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: standard.colors.campusRed,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: standard.colors.black,
  },
  timeLeft: {
    fontSize: 14,
    color: standard.colors.grey,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#D9E2F1",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: standard.colors.campusRed,
  },
});

export default ProgressBar;
