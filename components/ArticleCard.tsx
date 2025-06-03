import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import standard from "../theme";
import { News } from "../types/news";
import { auth } from "../firebase.config";
import { icons } from "../constants";
import ModalComponent from "./ModalComponent";
import ProgressBar from "./ProgressBar";
import { deleteNews, updateNewsStatus } from "../functions/newsFunctions";

interface NewsCardItemProps {
  news: News;
  onActionComplete?: () => void;
}

const ArticleCard: React.FC<NewsCardItemProps> = ({
  news,
  onActionComplete,
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pressedIcon, setPressedIcon] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "approve" | "delete" | null
  >(null);
  const [isMounted, setIsMounted] = useState(true);
  const processedThumbnailUri =
    news.thumbnail.includes("imgur.com") && !news.thumbnail.endsWith(".jpg")
      ? news.thumbnail + ".jpg"
      : news.thumbnail;

  const handleApprove = () => {
    setIsProcessing(true);
    setCurrentAction("approve");
  };

  const handleDelete = async () => {
    setDeleteModalOpen(false);
    setIsProcessing(true);
    setCurrentAction("delete");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.coverImageStyle}
        source={{ uri: processedThumbnailUri }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">
          {news.mainTitle.length > 50
            ? news.mainTitle.substring(0, 40) + "..."
            : news.mainTitle}
        </Text>
        <Text style={styles.authorStyle} numberOfLines={1}>
          Por: {news.authors.join(", ")}
        </Text>
      </View>
      <View style={styles.iconsContainer}>
        {news.published == false && !isProcessing && (
          <TouchableOpacity
            onPress={handleApprove}
            onPressIn={() => setPressedIcon("main")}
            onPressOut={() => setPressedIcon(null)}
          >
            <Image
              source={icons.checkIcon}
              style={[
                styles.iconStyle,
                {
                  tintColor:
                    pressedIcon === "main"
                      ? standard.colors.campusRed
                      : standard.colors.grey,
                },
              ]}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/writeNewsPage",
              params: { newsData: JSON.stringify(news) },
            });
          }}
          onPressIn={() => setPressedIcon("edit")}
          onPressOut={() => setPressedIcon(null)}
        >
          <Image
            source={icons.editIcon}
            style={[
              styles.iconStyle,
              {
                tintColor:
                  pressedIcon === "edit"
                    ? standard.colors.campusRed
                    : standard.colors.grey,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setDeleteModalOpen(true);
          }}
          onPressIn={() => setPressedIcon("trash")}
          onPressOut={() => setPressedIcon(null)}
        >
          <Image
            source={icons.trashIcon}
            style={[
              styles.iconStyle,
              {
                tintColor:
                  pressedIcon === "trash"
                    ? standard.colors.campusRed
                    : standard.colors.grey,
              },
            ]}
          />
        </TouchableOpacity>
        <ModalComponent
          label={
            "Tem certeza que deseja excluir este texto? Essa ação não poderá ser revertida."
          }
          isOpen={isDeleteModalOpen}
          icon={"reportIcon"}
          hasInput={false}
          onCancelButton={() => setDeleteModalOpen(false)}
          cancelButtonText={"Fechar"}
          onConfirmButton={handleDelete}
          confirmButtonText={"Excluir"}
        />
        <ProgressBar
          newsId={news.id}
          label={
            currentAction === "approve"
              ? "Postagem em andamento"
              : "Exclusão em progresso"
          }
          type={currentAction}
          isOpen={isProcessing}
          onClose={() => {
            setIsProcessing(false);
            onActionComplete && onActionComplete();
          }}
        />
      </View>
    </View>
  );
};

export default ArticleCard;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginVertical: 7,
    height: 80,
    overflow: "hidden",
    alignItems: "center",
  },
  coverImageStyle: {
    width: width * 0.3,
    height: "100%",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  titleStyle: {
    fontFamily: standard.fonts.semiBold,
    color: standard.colors.black,
    fontSize: 14,
    lineHeight: 20,
  },
  authorStyle: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.grey,
    fontSize: 12,
    marginTop: 5,
  },
  metaDataStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 6,
  },
  actionIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 5,
  },
  iconStyle: {
    width: 22,
    height: 22,
  },
});
