import { Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions, FlatList } from "react-native";
import React, { useState, useEffect, useRef, } from 'react';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase.config'
import { Feather, FontAwesome } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomDrawerButton from "./CustomDrawerButton";
import TrendingItem from "./TrendingItem";

const { width } = Dimensions.get('window');

interface Tag {
  id: string,
  name: string,
  newsCount: number,
  color: string,
}


const CustomDrawer = (props: any) => {
  const [tags, setTags] = useState<Tag[]>([])

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



  const { navigation } = props; // Obtenha a navegação do props;
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0}}>
            <View style={styles.arrowContainer}>
              <CustomDrawerButton icon={"arrowFowardIcon"} onPress={() => navigation.closeDrawer()}/>           
            </View>

            {/* Conteúdo principal */}
            <View style={styles.contentContainer}>
              {/* Hashtags */}
              <View style={styles.hashtagsContainer}>
                <View style={styles.grid}>
                  {tags.map((tag) => (
                    <Text key={tag.id} style={[styles.hashtag, { color: tag.color }]}>
                      {tag.name}
                    </Text>
                  ))}
                </View>
              </View>

              <CustomDrawerButton text={"Reportar Bug"}  icon={"bugIcon"} onPress={() => alert("Reportar Bug")} type={"primary"}/>

              {/* Menu */}
              <View style={styles.drawerList}>
                  <DrawerItemList {...props} />
              </View>

              {/* Social Media Icons */}
              <View style={styles.socialIconsContainer}>
                  {[
                  { name: "square-x-twitter", url : "https://x.com/campusitofacunb"},
                  { name: "instagram", url: "https://www.instagram.com/campusmultiplataforma/" },
                  { name: "linkedin", url: "https://www.linkedin.com/in/campusmultiplataforma/" },
                  { name: "square-youtube", url: "https://www.youtube.com/@campusitoUnB" },
                  ].map((icon, index) => (
                  <TouchableOpacity key={index} onPress={() => Linking.openURL(icon.url)}>
                      <FontAwesome6 name={icon.name} size={24} color="#6c0318" style={styles.icon} />
                  </TouchableOpacity>
                  ))}
              </View>
            </View>

            
            <CustomDrawerButton text={"Entrar"} icon={"loginIcon"} onPress={() => alert("Entrar")} type={"secondary"}/>
        </DrawerContentScrollView>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
    arrowContainer:{
      alignItems: "flex-end",
      marginRight: 10,
      marginBottom: 10,
    },
    backIcon: {
      padding: 10,
    },
    contentContainer: {
      flex: 1,
    },
    hashtagsContainer: {
        backgroundColor: "#FFFF",
        borderRadius: 8,
        padding: 10,      
    },
    grid:{
      flexDirection: "row",
      flexWrap: 'wrap', // Quebra linha ao exceder largura
    },
    hashtag: {
      fontSize: 16,
      marginHorizontal: 10,
      fontFamily: "Palanquin-SemiBold",
      marginBottom: 2
    },
    drawerList: {
      marginBottom: 20,
    },
    socialIconsContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    icon: {
      marginHorizontal: 7,
    },
})