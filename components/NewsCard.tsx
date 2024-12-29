import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import standard from '@/theme';
import { icons } from '@/constants';
import { News } from '../constants/types'

const { width } = Dimensions.get('window');

interface NewsCardItemProps {
    news: News;
}

const NewsCard: React.FC<NewsCardItemProps> = ({ news }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.coverImageStyle} source={{ uri: news.cover_image }} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle} numberOfLines={2} ellipsizeMode="tail">{news.title}</Text>
        <Text style={styles.subtitleStyle} numberOfLines={2} ellipsizeMode="tail">{news.subtitle}</Text>

        <View style={styles.metaDataStyle}>
          <Text style={styles.authorStyle}>Por: {news.author}</Text>
          <View style={styles.timeDataStyle}>
            <Image source={icons.clockIcon} style={styles.clockIconStyle} />
            <Text style={styles.timeStyle}>{news.created_at}</Text>
          </View>
        </View>
      </View>
    </View>
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
