import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import standard from '@/theme';
import { icons } from '@/constants';
import { News } from '../constants/types'
import { getRelativeTime } from '@/functions/newsFunctions';

const { width } = Dimensions.get('window');

interface NewsCardItemProps {
    news: News;
}

const NewsCard: React.FC<NewsCardItemProps> = ({ news }) => {
  const router = useRouter();

  const processedThumbnailUri =
  news.thumbnail.includes("imgur.com") && !news.thumbnail.endsWith(".jpg")
    ? news.thumbnail + ".jpg"
    : news.thumbnail;

  return (
    <TouchableOpacity onPress={() => router.push(`./newsPage?id=${news.id}`)} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.coverImageStyle} source={{ uri: processedThumbnailUri }} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">{news.mainTitle}</Text>
        <Text style={styles.subtitleStyle} numberOfLines={2} ellipsizeMode="tail">{news.description}</Text>

        <View style={styles.metaDataStyle}>
          <Text style={styles.authorStyle} numberOfLines={1}>Por: {news.authors.join(", ")}</Text>
          <View style={styles.timeDataStyle}>
            <Image source={icons.clockIcon} style={styles.clockIconStyle} />
            <Text style={styles.timeStyle}>{getRelativeTime(news.createdAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
  },
  imageContainer: {
    width: width * 0.35,
    height: 80,  
    justifyContent: 'flex-start', 
  },
  coverImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',  
  },
  titleStyle: {
    fontFamily: standard.fonts.semiBold,
    color: standard.colors.black,
    fontSize: 13,
    lineHeight: 16,
  },
  subtitleStyle: {
    fontFamily: standard.fonts.regular,
    color: standard.colors.black,
    fontSize: 10,
    opacity: 0.7,
    lineHeight: 13,
  },
  metaDataStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 5,  
  },
  authorStyle: {
    flex: 1,
    fontFamily: standard.fonts.bold,
    color: standard.colors.black,
    opacity: 0.5,
    fontSize: 10,
    alignSelf: 'flex-start',  
  },
  timeDataStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  clockIconStyle: {
    width: 10,
    height: 11,
  },
  timeStyle: {
    fontFamily: standard.fonts.regular,
    color: standard.colors.black,
    marginLeft: 3, 
    opacity: 0.6,
    fontSize: 10,
  },
});
