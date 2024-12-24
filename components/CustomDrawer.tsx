import { Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomDrawerButton from "./CustomDrawerButton";


const CustomDrawer = (props: any) => {
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
                  <ScrollView>
                      <View style={styles.grid}>
                          {["#FAC", "#eleicoes", "#RU", "#debate", "#jogos", "#videos", "#Geologia"].map((tag, index) => (
                              <Text key={index} style={[styles.hashtag, { color: index % 2 === 0 ? "green" : "red" }]}>
                                  {tag}
                              </Text>
                          ))}
                      </View>
                  </ScrollView>
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