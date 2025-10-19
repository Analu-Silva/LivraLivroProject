import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import BackButton from "../components/BackButton";

const primaryColor = '#B431F4';

// função simples de validação de e-mail
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // validações
  const emailIsValid = isValidEmail(email);
  const passwordIsValid = password.length >= 8;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formArea}>
          {/* EMAIL */}
          <CustomInput
            label="Email"
            placeholder="Insira seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            showValidationIcon
            isValid={email.length === 0 || emailIsValid}
          />

          {/* SENHA */}
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
            onPress={() => console.log('Esqueceu a senha?')}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!emailIsValid || !passwordIsValid) && styles.disabledButton,
            ]}
            onPress={() => navigation.navigate('Home')}
            disabled={!emailIsValid || !passwordIsValid}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: primaryColor,
    textAlign: 'center',
    paddingLeft: 15,
  },
  logoContainer: {
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formArea: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginLeft: '8%',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#111111ff',
  },
  loginButton: {
    width: '85%',
    height: 50,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
