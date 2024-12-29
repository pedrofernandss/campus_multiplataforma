import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomDrawerButton from "./CustomDrawerButton";
import { useRouter } from "expo-router";
import { fetchTags } from "@/functions/tagsFunctions";
import { types } from '@/constants'


const CustomDrawer = (props: any) => {
  const [tags, setTags] = useState<types.Tag[]>([])
  const router = useRouter();
  const { navigation } = props;

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

   // Obtenha a navegação do props;
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0}}>
            <View style={styles.arrowContainer}>
              <CustomDrawerButton icon={"arrowFowardIcon"} onPress={() => navigation.closeDrawer()}/>           
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.hashtagsContainer}>
                <View style={styles.grid}>
                  {tags.map((tag) => (
                    <Text key={tag.id} style={[styles.hashtag, { color: tag.color }]}>
                      {tag.name}
                    </Text>
                  ))}
                </View>
              </View>

              <CustomDrawerButton text={"Reportar Bug"}  icon={"bugIcon"} onPress={() => alert("Reportar Bug")} type={"active"}/>

              <View style={styles.drawerList}>
                <DrawerItemList {...props} />
              </View>

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

            
            <CustomDrawerButton text={"Entrar"} icon={"loginIcon"} onPress={() => router.push('/signInPage')}/>
        </DrawerContentScrollView>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
  arrowContainer:{
    alignItems: "flex-end",
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
    flexWrap: 'wrap',
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