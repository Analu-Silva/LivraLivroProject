import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createProfileDetails } from '../services/profileService';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; //caso precise usar


const primaryColor = '#B431F4';
const secondaryColor = '#a4dc22ff';

export default function ProfileCreationScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  React.useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        }
      } catch (error) {
        console.error('Erro ao carregar nome:', error);
      }
    };
    loadUserName();
  }, []);

  const openModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
  };

  const handleImagePick = () => {
    openModal('Funcionalidade de escolher foto será implementada.');
  };

const handleContinue = async () => {
  if (!gender) {
    openModal('Por favor, selecione seu gênero.');
    return;
  }

  // Pega o userId que vem da tela RegisterScreen
  const userId = route?.params?.userId;
  
  if (!userId) {
    openModal('Erro: userId não encontrado. Por favor, tente se registrar novamente.');
    return;
  }

  setLoading(true);
  try {
    const genderMap = {
      'masculino': 1,
      'feminino': 2,
      'outro': 3,
      'nao-informar': 3,
    };

    const detailsData = {
      userImageUrl: profileImage || '',
      userGenreId: genderMap[gender] || 3,
      description: description || '',
    };

    const response = await createProfileDetails(userId, detailsData);
    console.log('Detalhes do perfil criados:', response);

    openModal('Perfil criado com sucesso!');

    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate('Home');
    }, 1200);

  } catch (error) {
    openModal('Erro ao criar perfil: ' + (error.message || 'Tente novamente'));
    console.error('Erro:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.frame}>

          {/* Foto de perfil */}
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/perfil sem foto.png')
              }
              style={styles.intersect}
            />

            <View style={styles.editButton}>
              <Feather name="edit-2" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={styles.greeting}>Olá, {userName}!</Text>
          <Text style={styles.subGreeting}>Complete seu perfil.</Text>

          <Text style={styles.sectionLabel}>Gênero</Text>

          <View style={styles.genderOptions}>
            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('masculino')}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === 'masculino' && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.genderText}>Masculino</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('feminino')}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === 'feminino' && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.genderText}>Feminino</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderOption}
              onPress={() => setGender('outro')}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === 'outro' && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.genderText}>Outro</Text>
            </TouchableOpacity>
          </View>

          {/* Não informar */}
          <TouchableOpacity
            style={styles.genderOptionSingle}
            onPress={() => setGender('nao-informar')}
          >
            <View
              style={[
                styles.radioCircle,
                gender === 'nao-informar' && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.genderText}>Não informar</Text>
          </TouchableOpacity>

          <Text style={styles.descriptionLabel}>Descrição</Text>

          <TextInput
            style={styles.descriptionInput}
            placeholder="Nos fale mais sobre você..."
            placeholderTextColor={primaryColor}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.continueButton, loading && styles.disabledButton]}
            disabled={loading}
            onPress={handleContinue}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Feather name="check" size={21} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 50,
  },
  frame: {
    width: 265,
    position: 'relative',
  },
  imageContainer: {
    width: 224,
    height: 224,
    marginLeft: 16,
    marginTop: 30,
    position: 'relative',
  },
  intersect: {
    width: 224,
    height: 224,
    borderRadius: 112,
    resizeMode: 'cover',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    position: 'absolute',
    top: 271,
    left: 35,
    width: 204,
    fontSize: 26,
    fontWeight: '700',
    color: primaryColor,
    textAlign: 'center',
  },
  subGreeting: {
    position: 'absolute',
    top: 310,
    left: 50,
    width: 160,
    fontSize: 14,
    fontWeight: '600',
    color: primaryColor,
    textAlign: 'center',
  },
  sectionLabel: {
    position: 'absolute',
    top: 360,
    left: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  genderOptions: {
    position: 'absolute',
    top: 390,
    left: 10,
    flexDirection: 'row',
    gap: 18,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderOptionSingle: {
    position: 'absolute',
    top: 420,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.5,
    borderColor: primaryColor,
    marginRight: 5,
  },
  radioCircleSelected: {
    backgroundColor: primaryColor,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  descriptionLabel: {
    position: 'absolute',
    top: 460,
    left: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  descriptionInput: {
    position: 'absolute',
    top: 485,
    left: -2,
    width: 268,
    height: 130,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingTop: 9,
    fontSize: 14,
    fontWeight: '600',
    color: primaryColor,
  },
  continueButton: {
    position: 'absolute',
    top: 650,
    left: 230,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 260,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalButton: {
    backgroundColor: secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 23, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
