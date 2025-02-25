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
    const [isScrolling, setIsScrolling] = useState(false);

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
            if (totalWidth > 0 && !isScrolling) {
                Animated.timing(translateX, {
                    toValue: -totalWidth,
                    duration: 20000,
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
    }, [translateX, tags, isScrolling]);

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
                    <Animated.View style={[
                        styles.animatedTrendingText,
                        { 
                            transform: [{ translateX }],
                            width: tags.length * 150 * 2,
                        }
                    ]}>
                        <FlatList
                            data={[...tags, ...tags]}
                            horizontal
                            keyExtractor={(tag, index) => `${tag.id}-${index}`}
                            renderItem={({ item }) => <TrendingItem tag={item}/>}
                            showsHorizontalScrollIndicator={false}
                            onScrollBeginDrag={() => {
                                setIsScrolling(true);
                                translateX.stopAnimation();
                            }}
                            onScrollEndDrag={() => {
                                setIsScrolling(false);
                            }}
                            scrollEnabled={true}
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
