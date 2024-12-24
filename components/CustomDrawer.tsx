import { Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import MenuButton from "./MenuButton";


const CustomDrawer = (props: any) => {
  const { navigation } = props; // Obtenha a navegação do props;
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0}}>
            <View style={styles.arrowContainer}>
              <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                  <AntDesign name="arrowright" size={25} color='#7777' style={styles.backIcon} />
              </TouchableOpacity>            
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

              <MenuButton text={"Reportar Bug"}  icon={"bugIcon"} onPress={() => alert("Reportar Bug")}/>

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

            
            <MenuButton text={"Entrar"} icon={"loginIcon"} onPress={() => alert("Entrar")}/>
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
    loginContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginHorizontal: 13

    },
    loginIcon: {
      fontSize:25
    },
    loginText: {
      marginLeft: 10,
      fontSize: 16,
      color: "#7777",
      fontFamily: "Palanquin-SemiBold", 
      marginVertical: 15,
      fontWeight: "700"
    }
})