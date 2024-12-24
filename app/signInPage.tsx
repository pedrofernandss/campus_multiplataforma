import { StyleSheet, SafeAreaView, View, Text } from 'react-native'
import standard from "@/theme";
import CustomInput from "@/components/CustomInputText";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import CustomInputPassword from "@/components/CustomInputPassword";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase.config";

export default function signInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  const onForgotPasswordPressed = () => {
    console.warn('Botão de Esqueci minha senha funcionando')
  }

  const signIn = async () => {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Login bem-sucedido", userCredential.user.email)
    }


  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      
        <View style={styles.container}>
        <View style={styles.externalCircle} />
        <View style={styles.innerCircle} />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Bem vindo de volta!</Text>
          <View style={styles.innerContainer}>
            <CustomInput placeholder="Email" value={email} setValue={setEmail}/>
            <CustomInputPassword placeholder="Senha" value={password} setValue={setPassword}/>
            <CustomButton text={"Esqueci minha senha"} onPress={onForgotPasswordPressed} type="tertiary"/>
            <CustomButton text={"Acessar"} onPress={signIn} type="primary"/>
          </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: standard.colors.primaryWhite,
    flex: 1,
  },
  container: {
    padding: 20,
    marginTop: 70
  },
  externalCircle: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 250, 
    backgroundColor: standard.colors.primaryWhite,
    borderColor: '#F8F9FF',
    borderWidth: 2,
    top: -150, 
    right: -60,
  },
  innerCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 250, 
    backgroundColor: '#F8F9FF',
    top: -190, 
    right: -60, 
  },
  innerContainer:{
    marginTop: 40,
  },
  title: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.campusRed,
    fontSize: 30,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.black,
    fontSize: 20,
    textAlign: 'center'
  },
})