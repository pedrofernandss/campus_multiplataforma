import { StyleSheet, SafeAreaView, View, Text, ActivityIndicator, Alert } from "react-native";
import standard from "../theme";
import CustomInput from "../components/CustomInputText";
import { useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomInputPassword from "../components/CustomInputPassword";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import { router } from "expo-router";

export default function signInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  

  const onForgotPasswordPressed = () => {
    if (!email) {
      Alert.alert('', 'Por favor, insira seu endereço de e-mail.');
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('', 'E-mail de redefinição de senha enviado. Verifique sua caixa de entrada.');
      })
  }
  

  const signIn = async () => {
    setIsLoading(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(true)
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setIsLoading(false);
        router.push('/');
      }, 3000);

    } catch (error) {
      Alert.alert('', 'Ocorreu um erro ao efetuar login. Por favor, tente novamente.');
    }
  };


  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6C0318" style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <View style={styles.externalCircle} />
          <View style={styles.innerCircle} />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Bem vindo de volta!</Text>
          <View style={styles.innerContainer}>
            <CustomInput placeholder="Email" value={email} setValue={setEmail} />
            <CustomInputPassword placeholder="Senha" value={password} setValue={setPassword} />
            <CustomButton text={"Esqueci minha senha"} onPress={onForgotPasswordPressed} type="tertiary" />
            <CustomButton text={"Acessar"} onPress={signIn} type="primary" />
          </View>
        </View>
      )}
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
    marginTop: 70,
  },
  externalCircle: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 250,
    backgroundColor: standard.colors.primaryWhite,
    borderColor: "#F8F9FF",
    borderWidth: 2,
    top: -150,
    right: -60,
  },
  innerCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 250,
    backgroundColor: "#F8F9FF",
    top: -190,
    right: -60,
  },
  innerContainer: {
    marginTop: 40,
  },
  title: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.campusRed,
    fontSize: 30,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.black,
    fontSize: 20,
    textAlign: "center",
  },
});
