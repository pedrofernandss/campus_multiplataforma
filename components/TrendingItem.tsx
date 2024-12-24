import { StyleSheet,  View, Dimensions, Text, TouchableOpacity } from 'react-native'
import standard from '@/theme';
import React from 'react'


const {width} = Dimensions.get('window')

const TrendingItem = ({ item }) => {
    
   
  return (
    <TouchableOpacity style={styles.container}>
        <Text key={item.id} style={[styles.trendingItemText, { color: item.color }]}>
            {item.name}
        </Text>
    </TouchableOpacity>
  )
}

export default TrendingItem

const styles = StyleSheet.create({
    container: {
        padding: 4,
        borderRadius: 12,
    },
    trendingItemText: {
        //paddingHorizontal: width * 0.009, 
        fontSize: width * 0.05,
        fontFamily: standard.fonts.semiBold,
        color: standard.colors.campusRed,
    }
})