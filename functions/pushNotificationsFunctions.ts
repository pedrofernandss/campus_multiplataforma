import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, messaging } from "../firebase.config"
import { getToken } from "firebase/messaging"
import { requestPermissionsAsync, scheduleNotificationAsync, 
    addNotificationReceivedListener, addNotificationResponseReceivedListener } from "expo-notifications";

export async function registerForPushNotificationAsync() {
    const {status} = await requestPermissionsAsync();
    if(status !=="granted"){
        console.log("Permissão negada para notificações")
        return
    }

    const token = await getToken(messaging, {vapidKey: process.env.EXPO_PUBLIC_FIREBASE_FCM_VAPID_KEY})

    const tokensRef = collection(db, "deviceTokens");
    const queryTokens = query(tokensRef, where("token", "==", token));
    const querySnapshot = await getDocs(queryTokens)

    if(querySnapshot.empty){
        await addDoc(tokensRef, {token})
        console.log("TOKEN SALVO NO FIRESTORE", token)
    } else {
        console.log("TOKEN JÁ CADASTRADO")
    }

    return token
}