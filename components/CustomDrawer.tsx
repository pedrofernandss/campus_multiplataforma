import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomDrawerButton from "./CustomDrawerButton";
import { useRouter } from "expo-router";
import { fetchTags } from "../functions/tagsFunctions";
import { Tag } from "../types/tag";
import { User } from "../types/user";
import { auth } from "../firebase.config";
import * as types from "../types/index";
import ModalComponent from "./ModalComponent";
import {
  sendSugestionNewsEmail,
  sendBugInformEmail,
} from "../functions/emailFunctions";
import { fetchUser } from "../functions/userFunctions";

const CustomDrawer = (props: any) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [userIsLogged, setUserIsLogged] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isNewsSugestionModalOpen, setNewsSugestionModalOpen] = useState(false);
  const [newsSugestion, setNewsSugestion] = useState("");
  const [isBugInformModalOpen, setBugInformModalOpen] = useState(false);
  const [isDeniedAccessModalOpen, setDeniedAccessModalOpen] = useState(false);
  const [bugInform, setBugInform] = useState("");
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      setUserIsLogged(!!currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const fetchedUser = await fetchUser();
        setCurrentUser(fetchedUser[0]);
      } catch (error) {
        console.error("Erro ao buscar informações de usuário: ", error);
      }
    };

    loadUserData();
  }, [userIsLogged]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 0 }}
    >
      {currentUser && userIsLogged ? (
        <View style={styles.topContainer}>
          <View style={styles.leftSection}>
            <Image
              source={require("../assets/icons/campus-icon.png")}
              style={styles.logo}
            />
            <View>
              <Text style={styles.nameText}>{currentUser.name}</Text>
              <Text style={styles.roleText}>{currentUser.role}</Text>
            </View>
          </View>
          <View style={styles.loggedArrowContainer}>
            <CustomDrawerButton
              icon={"arrowFowardIcon"}
              onPress={() => navigation.closeDrawer()}
            />
          </View>
        </View>
      ) : (
        <View style={styles.unloggedArrowContainer}>
          <CustomDrawerButton
            icon={"arrowFowardIcon"}
            onPress={() => navigation.closeDrawer()}
          />
        </View>
      )}

      <View style={styles.contentContainer}>
        {!userIsLogged && (
          <View style={styles.hashtagsContainer}>
            <View style={styles.grid}>
              {tags.slice(0, 8).map((tag) => (
                <Text
                  key={tag.id}
                  style={[styles.hashtag, { color: tag.color }]}
                >
                  {tag.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {currentUser && userIsLogged ? (
          <>
            <CustomDrawerButton
              text={"Home"}
              icon={"homeIcon"}
              onPress={() => router.push("/")}
              type={"primary"}
            />
            <CustomDrawerButton
              text={"Escrever Texto"}
              icon={"descriptionIcon"}
              onPress={() => router.push('/writeNewsPage')}
              type={"primary"}
            />

            <View style={styles.separatorLogged}></View>

            <CustomDrawerButton
              text={"Painel do Editor"}
              icon={"calendarIcon"}
              onPress={() =>
                currentUser.role === "Editor"
                  ? router.push('/editorsPanel')
                  : setDeniedAccessModalOpen(true)
              }
              type={"primary"}
            />
            <ModalComponent
              title={"Acesso negado"}
              label={
                "Você não possui permissão para acessar essa página. Acesse com contas de editor para visualizar esta página."
              }
              isOpen={isDeniedAccessModalOpen}
              hasInput={false}
              onConfirmButton={() => {
                setDeniedAccessModalOpen(false);
              }}
              confirmButtonText={"Fechar"}
            />
            <CustomDrawerButton
              text={"Reportar Bug"}
              icon={"bugIcon"}
              onPress={() => setBugInformModalOpen(true)}
              type={"primary"}
            />
            <ModalComponent
              label={"Encontrou um bug? Informe aqui e nos ajude a melhorar"}
              icon={"redBugIcon"}
              isOpen={isBugInformModalOpen}
              hasInput={true}
              onCancelButton={() => {
                setBugInform("");
                setBugInformModalOpen(false);
              }}
              cancelButtonText={"Cancelar"}
              inputValue={bugInform}
              onInputChange={setBugInform}
              onConfirmButton={() => {
                sendBugInformEmail("template_ad0y2av", bugInform);
                setBugInform("");
                setBugInformModalOpen(false);
              }}
              confirmButtonText={"Enviar"}
            />
          </>
        ) : (
          <>
            <CustomDrawerButton
              text={"Sugerir Notícia"}
              icon={"sugestNews"}
              onPress={() => setNewsSugestionModalOpen(true)}
              type={"primary"}
            />
            <ModalComponent
              label={"Digite sua sugestão de notícia ou pauta abaixo:"}
              icon={"redSugestNews"}
              isOpen={isNewsSugestionModalOpen}
              hasInput={true}
              onCancelButton={() => {
                setNewsSugestion("");
                setNewsSugestionModalOpen(false);
              }}
              cancelButtonText={"Cancelar"}
              inputValue={newsSugestion}
              onInputChange={setNewsSugestion}
              onConfirmButton={() => {
                sendSugestionNewsEmail("template_f9foanu", newsSugestion);
                setNewsSugestion("");
                setNewsSugestionModalOpen(false);
              }}
              confirmButtonText={"Enviar"}
            />

            <CustomDrawerButton
              text={"Acessar Vídeos"}
              icon={"videosIcon"}
              onPress={() => router.push('/videosPage')}
              type={"primary"}
            />
            <CustomDrawerButton
              text={"Reportar Bug"}
              icon={"bugIcon"}
              onPress={() => setBugInformModalOpen(true)}
              type={"primary"}
            />
            <ModalComponent
              label={"Encontrou um bug? Informe aqui e nos ajude a melhorar"}
              icon={"redBugIcon"}
              isOpen={isBugInformModalOpen}
              hasInput={true}
              onCancelButton={() => {
                setBugInform("");
                setBugInformModalOpen(false);
              }}
              cancelButtonText={"Cancelar"}
              inputValue={bugInform}
              onInputChange={setBugInform}
              onConfirmButton={() => {
                sendBugInformEmail("template_ad0y2av", bugInform);
                setBugInform("");
                setBugInformModalOpen(false);
              }}
              confirmButtonText={"Enviar"}
            />

            <View style={styles.separatorUnlogged}></View>

            <View style={styles.drawerList}>
              <DrawerItemList {...props} />
            </View>

            <View style={styles.socialIconsContainer}>
              {[
                {
                  name: "square-x-twitter",
                  url: "https://x.com/campusitofacunb",
                },
                {
                  name: "instagram",
                  url: "https://www.instagram.com/campusmultiplataforma/",
                },
                {
                  name: "linkedin",
                  url: "https://www.linkedin.com/in/campusmultiplataforma/",
                },
                {
                  name: "square-youtube",
                  url: "https://www.youtube.com/@campusitoUnB",
                },
              ].map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => Linking.openURL(icon.url)}
                >
                  <FontAwesome6
                    name={icon.name}
                    size={24}
                    color="#6c0318"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      {userIsLogged ? (
        <>
          <CustomDrawerButton
            text={"Sair"}
            icon={"logoutIcon"}
            onPress={() => {
              auth
                .signOut()
                .then(() => {
                  router.push("/");
                })
                .catch((error) => {
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
            onPress={() => router.push("/signInPage")}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 7,
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
    justifyContent: "center", 
    alignItems: "center",
  },
  unloggedArrowContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  backIcon: {
    padding: 10,
  },
  separatorLogged: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 7,
  },
  separatorUnlogged: {
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hashtag: {
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: "Palanquin-SemiBold",
    marginBottom: 2,
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
});
