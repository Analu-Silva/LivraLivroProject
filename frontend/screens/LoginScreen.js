import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import CustomInput from "../components/CustomInput";
import BackButton from "../components/BackButton";
import { signin } from '../services/authService';
import { Alert, ActivityIndicator } from 'react-native';

const primaryColor = "#B431F4";

// Validação simples de e-mail
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const emailIsValid = isValidEmail(email);
  const passwordIsValid = password.length >= 8;

    const handleLogin = async () => {
    if (!emailIsValid || !passwordIsValid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    try {
      const response = await signin(email, password);
      console.log('Login bem-sucedido:', response);
      // Função que salvaria o userId em algum lugar (AsyncStorage depois)
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert('Erro no Login', error.message || 'Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.navigate("Register")} />
          <Text style={styles.title}>Login</Text>
        </View>

        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* FORM */}
        <View style={styles.formArea}>
          <CustomInput
            label="Email"
            placeholder="Insira seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            showValidationIcon
            isValid={email.length === 0 || emailIsValid}
          />

          <CustomInput
            label="Senha"
            placeholder="Insira sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showValidationIcon
            isValid={password.length === 0 || passwordIsValid}
          />

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => console.log("Esqueceu a senha?")}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!emailIsValid || !passwordIsValid) && styles.disabledButton,
            ]}
            onPress={() => navigation.navigate("Home")}
            disabled={!emailIsValid || !passwordIsValid}
          >
            <Text style={styles.loginButtonText}>Logar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 5,
    paddingHorizontal: 20, 
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryColor,
    marginLeft: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 25,
  },
  logo: {
    width: 130,
    height: 130,
  },
  formArea: {
    width: "100%",
    paddingHorizontal: 20, 
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 30, 
    marginTop: 5,
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: "#111",
  },
  loginButton: {
    backgroundColor: primaryColor,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "65%",
    alignSelf: "center",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
