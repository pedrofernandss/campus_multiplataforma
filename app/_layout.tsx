import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import React from 'react'
import 'react-native-gesture-handler'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons';
import CustomDrawer from '@/components/CustomDrawer';


const DrawerLayout = () => {
  
  const [fontsLoaded, error] = useFonts({
    "Palanquin-Regular": require("../assets/fonts/Palanquin-Regular.ttf"),
    "Palanquin-SemiBold": require("../assets/fonts/Palanquin-SemiBold.ttf"),
    "Palanquin-Bold": require("../assets/fonts/Palanquin-Bold.ttf")
  });


  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  } 

  return (
    <GestureHandlerRootView>
      <Drawer 
      drawerContent={props => <CustomDrawer {...props}/>}
      screenOptions={{ 
        drawerItemStyle: {display: 'none'},
        headerShown: false,
        drawerActiveBackgroundColor: "transparent",
        drawerInactiveBackgroundColor: "transparent",
        drawerInactiveTintColor: "#818181",
        drawerActiveTintColor: '#6c0318',
        drawerHideStatusBarOnOpen: true,
        drawerStyle: {
          backgroundColor: "#f5f5f5",
          paddingTop: 32,
          width: "65%"
        },
        drawerLabelStyle:{
          marginLeft: -6,

        },
        drawerPosition: 'right',
      }}>
      </Drawer>
    </GestureHandlerRootView>
  )
}


export default DrawerLayout 


