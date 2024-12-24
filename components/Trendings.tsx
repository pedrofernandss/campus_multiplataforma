import { Image, View, Text, Animated, FlatList, Dimensions, StyleSheet } from 'react-native';
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase.config'
import { icons } from '@/constants';
import standard from '@/theme';
import TrendingItem from './TrendingItem';

const { width } = Dimensions.get('window');

interface Tag {
    id: string,
    name: string,
    newsCount: number,
    color: string,
}

const Trendings: React.FC = () => {
    const [tags, setTags] = useState<Tag[]>([]); // Tipagem correta para o estado
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getDocs(collection(db, "tags")); // Pega documentos da coleção 'tags'
                const tags = response.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Tag[]; 
                tags.sort((a, b) => b.newsCount - a.newsCount);
                setTags(tags); 
            } catch (error) {
                console.error("Erro ao buscar as tags: ", error);
            }
        };

        fetchTags();
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
        <View style={styles.container}>
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
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <TrendingItem item={item}/> }
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
    container: {
        // padding: 1,
        // borderRadius: 12,
    },
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
