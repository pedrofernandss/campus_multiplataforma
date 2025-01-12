import { Linking, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from "react-native";
import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import CustomDrawerButton from "./CustomDrawerButton";
import { useRouter } from "expo-router";
import { fetchTags } from "@/functions/tagsFunctions";
import { types } from '@/constants'
import { auth } from "../firebase.config";


const CustomDrawer = (props: any) => {
  const [tags, setTags] = useState<types.Tag[]>([])
  const [user, setUser] = useState(null)
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

    // Verifica o estado do usuário no Firebase Auth
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
        setUser(currentUser); // Atualiza o estado com o usuário logado ou null
      });
  
      return () => unsubscribe(); // Cleanup ao desmontar o componente
    }, []);


   // Obtenha a navegação do props;
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0}}>
            {user ? (
              <View style={styles.topContainer}>
                <View style={styles.leftSection}>
                  <Image
                    source={require('../assets/icons/campus-icon.png')} // Substitua pela URL da logo
                    style={styles.logo}
                  />
                  <View>
                    <Text style={styles.nameText}>Campusito</Text>
                    <Text style={styles.roleText}>Repórter</Text>
                  </View>
                </View>
                <View style={styles.loggedArrowContainer}>
                  <CustomDrawerButton icon={"arrowFowardIcon"} onPress={() => navigation.closeDrawer()}/>           
                </View>
              </View>
            ):
            (
              <View style={styles.unloggedArrowContainer}>
                <CustomDrawerButton icon={"arrowFowardIcon"} onPress={() => navigation.closeDrawer()}/>           
              </View>
            )}

            <View style={styles.contentContainer}>
              {/* Hashtags */}
              {!user && (
                <View style={styles.hashtagsContainer}>
                  <View style={styles.grid}>
                    {tags.slice(0, 8).map((tag) => (
                      <Text key={tag.id} style={[styles.hashtag, { color: tag.color }]}>
                        {tag.name}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {user ? (
                        <>
                          <CustomDrawerButton 
                            text={"Home"}  
                            icon={"homeIcon"} 
                            onPress={() => router.push('/')} 
                            type={"primary"}
                          />
                          <CustomDrawerButton
                            text={"Escrever Artigo"}
                            icon={"descriptionIcon"}
                            onPress={() => Alert.alert('Escrever Artigo')}
                            type={"primary"}
                          />

                          <View style={styles.separatorLogged}></View>

                          <CustomDrawerButton
                            text={"Painel de Artigos"}
                            icon={"calendarIcon"}
                            onPress={() => Alert.alert('Painel de artigos')}
                            type={"primary"}
                          />
                          <CustomDrawerButton 
                            text={"Reportar Bug"}  
                            icon={"bugIcon"} 
                            onPress={() => alert("Reportar Bug")} 
                            type={"primary"}
                          />
                        </>
                      ) : (
                        <>
                          <CustomDrawerButton 
                            text={"Reportar Bug"}  
                            icon={"bugIcon"} 
                            onPress={() => alert("Reportar Bug")} 
                            type={"primary"}
                          />

                          <View style={styles.separatorUnlogged}></View>

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
                        </>
              )}
            </View>

            {user ? (
                      <>
                        <CustomDrawerButton 
                          text={"Sair"} 
                          icon={"logoutIcon"} 
                          onPress={() => {
                            auth.signOut().then(() => {
                              router.push('/');
                              console.log("Sign Out realizado com sucesso")
                            }).catch((error) => {
                              console.error("Erro ao sair: ", error);
                            });
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <CustomDrawerButton 
                          text={"Entrar"} 
                          icon={"loginIcon"} 
                          onPress={() => router.push('/signInPage')}
                        />
                      </>
            )}
            
        </DrawerContentScrollView>
    )
}

export default CustomDrawer;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 7
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#d32f2f",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  roleText: {
    fontSize: 14,
    color: "#666",
  },
  loggedArrowContainer: {
    justifyContent: "center", // Ajusta para centralizar no eixo vertical
    alignItems: "center",
  },
  unloggedArrowContainer:{
    alignItems: "flex-end",
    marginBottom: 10,
  },
  backIcon: {
    padding: 10,
  },
  separatorLogged:{
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 7,
  },
  separatorUnlogged:{
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#6c0318",
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