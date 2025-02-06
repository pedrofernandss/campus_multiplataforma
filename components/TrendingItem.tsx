import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import standard from '../theme';
import { Tag } from '../types/tag';

const { width } = Dimensions.get('window')

interface TrendingItemProps {
    tag: Tag;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ tag }) => {
    return (
        <TouchableOpacity style={styles.container}>
            <Text key={tag.id} style={[styles.trendingItemText, { color: tag.color }]}>
                {tag.name}
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
        fontSize: width * 0.05,
        fontFamily: standard.fonts.semiBold,
        color: standard.colors.campusRed,
    }
})