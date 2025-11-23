import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import CustomInput from "../components/CustomInput";
import BackButton from "../components/BackButton";
import { signin } from '../services/authService';
import { Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

const primaryColor = "#B431F4";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBagModalVisible, setIsBagModalVisible] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    if (route && route.params && route.params.fromRegister && route.params.email) {
      setEmail(route.params.email);
      Alert.alert('Cadastro', 'Cadastro realizado com sucesso. Faça login.');
    }
  }, [route]);

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
      console.log('Login bem-sucedido:', JSON.stringify(response, null, 2));
      
      // EXTRAIR DADOS CORRETAMENTE - ATUALIZADO
      const token = response?.token || response?.accessToken || response?.access_token;
      const userId = response?.user?.id || response?.id || response?.userId;
      
      // AQUI: Buscar o nome completo corretamente
      const userName = response?.user?.name || 
                       response?.user?.username || 
                       response?.user?.fullName ||
                       response?.name || 
                       response?.fullName ||
                       response?.username;

      console.log('Token:', token);
      console.log('UserId:', userId);
      // se userId não estiver presente, tentar extrair do token JWT (se for JWT)
      let resolvedUserId = userId;
      if (!resolvedUserId && token) {
        try {
          // Apenas tenta se atob existir (ambientes web). Evita crash em React Native puro.
          if (typeof atob === 'function') {
            const payload = token.split('.');
            if (payload.length >= 2) {
              const b64 = payload[1].replace(/-/g, '+').replace(/_/g, '/');
              const json = decodeURIComponent(atob(b64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              const obj = JSON.parse(json);
              resolvedUserId = obj.sub || obj.userId || obj.id || obj.nameid || obj.nameId || resolvedUserId;
            }
          }
        } catch (e) {
          // ignora se o token não for JWT ou se o ambiente não suportar atob
        }
      }
      console.log('UserName:', userName);
      console.log('🔍 Response completo:', JSON.stringify(response, null, 2));

      // USAR O AUTHCONTEXT PARA SALVAR
      const success = await login(token, resolvedUserId || userId, userName);
      
      if (success) {
        console.log('✅ Login salvo com sucesso');
        navigation.navigate("Home");
      } else {
        throw new Error('Erro ao salvar dados de login');
      }

    } catch (error) {
      let title = 'Erro no Login';
      let message = error.message || 'Email ou senha inválidos';
      const status = error && error.status ? error.status : null;

      if (status === 404 || /not found|não encontrado|not_found/i.test(message)) {
        title = 'Email não encontrado';
        message = 'O email informado não está cadastrado.';
      } else if (status === 401 || /senha|password|invalid credentials|credenciais/i.test(message)) {
        title = 'Senha incorreta';
        message = 'A senha informada está incorreta.';
        setPassword('');
      }

      setErrorTitle(title);
      setErrorMessage(message);
      setShowErrorModal(true);
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
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Login</Text>
          <TouchableOpacity
            style={styles.bagIconButton}
            onPress={() => setIsBagModalVisible(true)}
          >
          </TouchableOpacity>
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
            onPress={handleLogin}
            disabled={!emailIsValid || !passwordIsValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Logar</Text>
            )}
          </TouchableOpacity>

          <Modal
            visible={isBagModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsBagModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Modal de Bloqueio</Text>
                <Text style={styles.modalText}>
                  Exemplo: aqui você pode mostrar uma mensagem de bloqueio
                  ao clicar no ícone de sacola.
                </Text>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setIsBagModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showErrorModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowErrorModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{errorTitle || 'Erro'}</Text>
                <Text style={styles.modalText}>{errorMessage}</Text>
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowErrorModal(false)}
                >
                  <Text style={styles.closeModalButtonText}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  bagIconButton: {
    marginLeft: 'auto',
    padding: 6,
  },
  bagIcon: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: primaryColor,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});