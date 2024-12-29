import { Image, View, Text, Animated, FlatList, Dimensions, StyleSheet } from 'react-native';
import { fetchTags } from '@/functions/tagsFunctions';
import React, { useEffect, useRef, useState } from 'react';
import { icons, types } from '@/constants';
import standard from '@/theme';
import TrendingItem from './TrendingItem';

const { width } = Dimensions.get('window');

const Trendings: React.FC = () => {

    const [tags, setTags] = useState<types.Tag[]>([]);
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadTags = async () => {
            try {
                const fetchedTags = await fetchTags();
                setTags(fetchedTags);
            } catch (error) {
                console.error("Erro ao buscar as tags: ", error);
            }
        };

        loadTags();
    }, []);

    useEffect(() => {
        const totalWidth = tags.length * 150;
        const startAnimation = () => {
            if (totalWidth > 0) {
                translateX.setValue(0);
                Animated.timing(translateX, {
                    toValue: -totalWidth+500,
                    duration: 13000,
                    useNativeDriver: true,
                }).start(() => {
                    translateX.setValue(0);
                    startAnimation();
                });
            }
        };

        startAnimation();

        return () => {
            translateX.stopAnimation();
        };
    }, [translateX, tags]);

    return (
        <View>
            <View style={styles.innerContainer}>
                <Image 
                    source={icons.trendingIcon}
                    style={styles.trendingIcon}
                    resizeMode="contain"           
                />
                <Text style={styles.labelText}>Em alta</Text>
                <View style={styles.overflowTransformation}>
                    <Animated.View style={[{ transform: [{ translateX }], width: tags.length*150}, styles.animatedTrendingText]}>
                        <FlatList
                            data={tags}
                            horizontal
                            keyExtractor={(tag) => tag.id.toString()}
                            renderItem={({ item }) => <TrendingItem tag={item}/> }
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    trendingIcon:{
        width: width * 0.09,
        height: width * 0.09,
    },
    labelText: {
        marginLeft: 4, 
        marginRight: 8, 
        fontSize: width * 0.05, 
        fontFamily: standard.fonts.semiBold, 
        color: 'black',
    },
    overflowTransformation:{
        overflow: 'hidden'
    },
    animatedTrendingText:{
        flexDirection: 'row',
    },
});

export default Trendings;
