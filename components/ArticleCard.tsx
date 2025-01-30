import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import standard from '@/theme';
import { News } from '../types/news'
import { auth } from "../firebase.config";
import { icons } from '@/constants';
const { width } = Dimensions.get('window');

interface NewsCardItemProps {
    news: News;
}

const ArticleCard: React.FC<NewsCardItemProps> = ({ news }) => {
  const router = useRouter();
  const [pressedIcon, setPressedIcon] = useState<string | null>(null);
  const processedThumbnailUri =
  news.thumbnail.includes("imgur.com") && !news.thumbnail.endsWith(".jpg")
    ? news.thumbnail + ".jpg"
    : news.thumbnail;

  return (
    
    <View style={styles.container}>
        <Image style={styles.coverImageStyle} source={{ uri: processedThumbnailUri }} />
        <View style={styles.contentContainer}>
          <Text style={styles.titleStyle} numberOfLines={3} ellipsizeMode="tail">
            {news.mainTitle.length > 50 ? news.mainTitle.substring(0, 40) + "..." : news.mainTitle}
          </Text>
            <Text style={styles.authorStyle} numberOfLines={1}>Por: {news.authors.join(", ")}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity 
            onPressIn={() => setPressedIcon("main")}
            onPressOut={() => setPressedIcon(null)}
          >
            <Image
              source={icons.checkIcon} // Ajuste para o ícone correto
              style={[
                styles.iconStyle,
                { tintColor: pressedIcon === "main" ? standard.colors.campusRed : standard.colors.grey }
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPressIn={() => setPressedIcon("edit")}
            onPressOut={() => setPressedIcon(null)}
          >
            <Image 
              source={icons.editIcon} 
              style={[
                styles.iconStyle,
                { tintColor: pressedIcon === "edit" ? standard.colors.campusRed : standard.colors.grey }
              ]}
            />          
          </TouchableOpacity>
          <TouchableOpacity 
            onPressIn={() => setPressedIcon("trash")}
            onPressOut={() => setPressedIcon(null)}          
          >
            <Image 
              source={icons.trashIcon} 
              style={[
                styles.iconStyle,
                { tintColor: pressedIcon === "trash" ? standard.colors.campusRed : standard.colors.grey }
              ]}
            />          
          </TouchableOpacity>

        </View>
    </View>

  );
};

export default ArticleCard;

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      borderRadius: 12,
      backgroundColor: '#ffffff',
      marginHorizontal: 20,
      marginVertical: 7,
      height: 100, 
      overflow: 'hidden',
      alignItems: 'center',
      
  },
  coverImageStyle: {
      width: width * 0.3, 
      height: '100%', 
      borderTopLeftRadius: 12,
      borderBottomLeftRadius: 12,
  },
  contentContainer: {
      flex: 1,
      paddingHorizontal: 15,
      justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 6,  
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 5,
  },
  iconStyle: {
    width: 22,
    height: 22,
  },

});