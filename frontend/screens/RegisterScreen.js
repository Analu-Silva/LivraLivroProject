import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import BackButton from '../components/BackButton'; 

// cores
const primaryColor = '#B431F4';
const secundaryColor = '#A8F000';
const textColor = '#333333';

// validações
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const validateCpfAlgorithm = (cpfText) => {
  if (!cpfText) return false;
  const cleanCpf = cpfText.replace(/\D/g, '');
  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
};

const validatePhoneLength = (phoneText) => {
  if (!phoneText) return false;
  const cleanPhone = phoneText.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

const validateFullDate = (dateString) => {
  const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regexData);
  if (!match) return false;

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  const ano = parseInt(match[3], 10);

  const dataObjeto = new Date(ano, mes - 1, dia);
  if (
    dataObjeto.getFullYear() !== ano ||
    dataObjeto.getMonth() !== mes - 1 ||
    dataObjeto.getDate() !== dia ||
    isNaN(dataObjeto.getTime())
  ) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  dataObjeto.setHours(0, 0, 0, 0);

  if (dataObjeto > hoje) return false;
  const limiteMinAno = hoje.getFullYear() - 120;
  if (ano < limiteMinAno) return false;

  return true;
};

// Requisitos da senha
const PasswordRequirementItem = ({ isValid, text }) => {
  const iconSource = isValid
    ? require('../assets/right icon.png')
    : require('../assets/wrong icon.png');

  return (
    <View style={passwordRequirementStyles.requirementItem}>
      <Image source={iconSource} style={passwordRequirementStyles.iconImage} resizeMode="contain" />
      <Text style={passwordRequirementStyles.text}>{text}</Text>
    </View>
  );
};

const passwordRequirementStyles = StyleSheet.create({
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconImage: {
    width: 13,
    height: 13,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: primaryColor,
  },
});

// Modais
const AgeRestrictionModal = ({ visible, onClose }) => (
  <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.overlay}>
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.modalMessage}>
          Proibido cadastro de usuários menores de 12 anos.
        </Text>
        <TouchableOpacity style={modalStyles.modalButton} onPress={onClose}>
          <Text style={modalStyles.modalButtonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const SuccessModal = ({ visible, onClose, onConfirm }) => (
  <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
    <View style={modalStyles.overlay}>
      <View style={modalStyles.modalBox}>
        <Text style={modalStyles.modalMessage}>Sua conta foi criada com sucesso!</Text>
        <TouchableOpacity
          style={[modalStyles.modalButton, { backgroundColor: secundaryColor }]}
          onPress={onConfirm}
        >
          <Text style={modalStyles.modalButtonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: { 
    width: 301,
    minHeight: 121,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    borderWidth: 0,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  modalMessage: { 
    width: 274,
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  modalButton: { 
    width: 181,
    height: 41,
    borderRadius: 31,
    backgroundColor: secundaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: { 
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [isPasswordSectionFocused, setIsPasswordSectionFocused] = useState(false);
  const [showAgeRestrictionModal, setShowAgeRestrictionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValidCpfState, setIsValidCpfState] = useState(false);
  const [isValidPhoneState, setIsValidPhoneState] = useState(false);
  const [isValidFullDateState, setIsValidFullDateState] = useState(false);

  // validação senha
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordValid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;

  const showPasswordRequirements = isPasswordSectionFocused || password.length > 0 || confirmPassword.length > 0;

  const canProceedToStep2 = isValidEmail(email) && isPasswordValid && passwordsMatch;
  const canCreateAccountButton =
    cpf.length > 0 && isValidCpfState &&
    phone.length > 0 && isValidPhoneState &&
    birthDate.length === 10 && isValidFullDateState;

  // formatadores e validadores
  const handleBirthDateChange = (text) => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 2) formattedText = formattedText.substring(0, 2) + '/' + formattedText.substring(2);
    if (formattedText.length > 5) formattedText = formattedText.substring(0, 5) + '/' + formattedText.substring(5);
    if (formattedText.length > 10) formattedText = formattedText.substring(0, 10);
    setBirthDate(formattedText);
    setIsValidFullDateState(formattedText.length === 10 ? validateFullDate(formattedText) : false);
  };

  const handleCpfChange = (text) => {
    let rawText = text.replace(/\D/g, '');
    if (rawText.length > 11) rawText = rawText.substring(0, 11);
    let formattedCpf = rawText;
    if (rawText.length > 3) formattedCpf = rawText.substring(0, 3) + '.' + rawText.substring(3);
    if (rawText.length > 6) formattedCpf = formattedCpf.substring(0, 7) + '.' + rawText.substring(6);
    if (rawText.length > 9) formattedCpf = formattedCpf.substring(0, 11) + '-' + rawText.substring(9);
    setCpf(formattedCpf);
    setIsValidCpfState(validateCpfAlgorithm(rawText));
  };

  const handlePhoneChange = (text) => {
    let rawText = text.replace(/\D/g, '');
    if (rawText.length > 11) rawText = rawText.substring(0, 11);
    let formattedPhone = '';
    if (rawText.length > 0) formattedPhone = `(${rawText.substring(0, 2)}`;
    if (rawText.length >= 3) {
      if (rawText.length <= 10) {
        formattedPhone += `) ${rawText.substring(2, 6)}`;
        if (rawText.length >= 7) formattedPhone += `-${rawText.substring(6, 10)}`;
      } else {
        formattedPhone += `) ${rawText.substring(2, 7)}`;
        if (rawText.length >= 8) formattedPhone += `-${rawText.substring(7, 11)}`;
      }
    }
    setPhone(formattedPhone);
    setIsValidPhoneState(validatePhoneLength(rawText));
  };

  const isUnderage = () => {
    if (!isValidFullDateState || birthDate.length !== 10) return false;
    const parts = birthDate.split('/');
    const birthDateObj = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) age--;
    return age < 12;
  };

  const handleRegister = () => {
    if (!canCreateAccountButton) {
      Alert.alert('Erro de Validação', 'Por favor, preencha todos os campos corretamente.');
      return;
    }
    if (isUnderage()) {
      setShowAgeRestrictionModal(true);
      return;
    }
    setShowSuccessModal(true);
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    navigation.navigate('ProfileCreation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => (step === 2 ? setStep(1) : navigation.navigate('Start'))} />
          <Text style={styles.title}>Cadastro</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {step === 1 && (
          <View style={styles.formArea}>
            {/* EMAIL — com ícone */}
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Insira seu e-mail"
              keyboardType="email-address"
              showValidationIcon={true}
              isValid={email.length === 0 || isValidEmail(email)}
            />

            {/* SENHA — sem ícone, pois mostra os requisitos */}
            <View style={styles.passwordInputGroup}>
              <CustomInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Insira sua senha"
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color={primaryColor}
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRMAR SENHA — com ícone */}
            <View style={styles.passwordInputGroup}>
              <CustomInput
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua senha"
                secureTextEntry={!showConfirmPassword}
                isValid={confirmPassword.length === 0 || passwordsMatch}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showConfirmPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color={primaryColor}
                />
              </TouchableOpacity>
            </View>

            {/* REQUISITOS DE SENHA */}
            {showPasswordRequirements && (
              <View style={styles.passwordRequirementsContainer}>
                <PasswordRequirementItem
                  isValid={hasLowerCase && hasUpperCase}
                  text="Letras minúsculas e maiúsculas"
                />
                <PasswordRequirementItem isValid={hasNumber} text="Números" />
                <PasswordRequirementItem isValid={hasSpecialChar} text="Caractere especial" />
                <PasswordRequirementItem isValid={hasMinLength} text="Pelo menos 8 caracteres" />
                <PasswordRequirementItem isValid={passwordsMatch} text="Senhas coincidem" />
              </View>
            )}

            {/* BOTÃO CONTINUAR */}
            <TouchableOpacity
              style={[styles.continueButton, !canProceedToStep2 && styles.disabledButton]}
              disabled={!canProceedToStep2}
              onPress={() => setStep(2)}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.formArea}>
            {/* CPF — com ícone */}
            <CustomInput
              label="CPF"
              value={cpf}
              onChangeText={handleCpfChange}
              placeholder="000.000.000-00"
              keyboardType="numeric"
              maxLength={14}
              showValidationIcon={true}
              isValid={isValidCpfState}
            />

            {/* CELULAR — com ícone */}
            <CustomInput
              label="Celular"
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="(XX) XXXXX-XXXX"
              keyboardType="phone-pad"
              maxLength={15}
              showValidationIcon={true}
              isValid={isValidPhoneState}
            />

            {/* DATA DE NASCIMENTO — com ícone */}
            <CustomInput
              label="Data de Nascimento"
              value={birthDate}
              onChangeText={handleBirthDateChange}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              showValidationIcon={true}
              isValid={isValidFullDateState && birthDate.length === 10}
            />

            {/* BOTÃO CRIAR CONTA */}
            <TouchableOpacity
              style={[styles.continueButton, !canCreateAccountButton && styles.disabledButton]}
              disabled={!canCreateAccountButton}
              onPress={handleRegister}
            >
              <Text style={styles.continueButtonText}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        )}

        <AgeRestrictionModal visible={showAgeRestrictionModal} onClose={() => setShowAgeRestrictionModal(false)} />
        <SuccessModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)} onConfirm={handleSuccessModalConfirm} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 5 },
  backButton: { marginRight: 15 },
  title: {  fontSize: 26,
    fontWeight: '600',
    color: primaryColor,
    textAlign: 'center',
    paddingLeft: 15,
  },
  logoContainer: { marginVertical: 20 },
  logo: { width: 120, height: 120 },
  formArea: { width: '100%', alignItems: 'center' },
  passwordInputGroup: { width: '100%', position: 'relative', marginBottom: 10 },
  passwordRequirementsContainer: { width: '85%', alignSelf: 'center', marginBottom: 20, marginTop: 10 },
  continueButton: { width: '85%', height: 50, backgroundColor: primaryColor, justifyContent: 'center', alignItems: 'center', borderRadius: 25, marginTop: 20 },
   continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 40,
    top: 42,
  },
});

