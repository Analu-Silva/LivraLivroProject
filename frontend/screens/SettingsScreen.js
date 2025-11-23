import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadToCloudinary } from '../services/bookService';
import { getProfileInfo, updateProfileInfo, createProfileDetails, getProfileDetails, updateProfileDetails } from '../services/profileService';
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";
const secondaryColor = "#a4dc22ff";

export default function EditProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("feminino");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ Modais
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImagePick = () => {
    (async () => {
      try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.status !== 'granted') {
          setShowMissingFieldsModal(true);
          return;
        }

        const mediaTypesOption = ImagePicker?.MediaTypeOptions?.Images ?? ImagePicker?.MediaType?.Images ?? ImagePicker?.MediaTypeOptions?.All;
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaTypesOption,
          allowsEditing: true,
          quality: 0.8,
        });

        if (result.canceled === true || result.cancelled === true) return;

        let selectedUri;
        if (result.assets && result.assets.length > 0) selectedUri = result.assets[0].uri;
        else if (result.uri) selectedUri = result.uri;

        if (!selectedUri) return;

        // mostra pré-visualização temporária
        setProfileImage(selectedUri);

        // envia para o Cloudinary
        try {
          const uploaded = await uploadToCloudinary(selectedUri);
          setProfileImage(uploaded);
        } catch (e) {
          console.error('Erro upload profile image:', e);
          setShowMissingFieldsModal(true);
        }
      } catch (e) {
        console.warn('Erro pick image', e);
      }
    })();
  };

  const handleSave = () => {
    (async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setShowMissingFieldsModal(true);
          return;
        }

        // Monta payload de info apenas com valores não vazios para evitar enviar campos em branco
        const infoData = {};
        if (name && name.trim().length > 0) infoData.name = name.trim();
        if (email && email.trim().length > 0) infoData.email = email.trim();
        if (profileImage) {
          infoData.photo = profileImage;
          infoData.image = profileImage;
          infoData.userImageUrl = profileImage;
          infoData.userImage = profileImage;
        }

        // Se houver algo para atualizar nas informações do perfil, mescla com as info existentes e chama o endpoint de atualização
        if (Object.keys(infoData).length > 0) {
          try {
            const existingInfo = await getProfileInfo(userId).catch(() => ({}));
            const infoPayload = { ...existingInfo, ...infoData };
            Object.keys(infoPayload).forEach(k => infoPayload[k] === undefined && delete infoPayload[k]);
            await updateProfileInfo(userId, infoPayload);
          } catch (e) {
            try { await updateProfileInfo(userId, infoData); } catch (e2) { throw e2; }
          }
        }

        // Atualiza credenciais (senha) se fornecida
        if (newPassword && newPassword.trim().length > 0) {
          try {
            // importa authService sob demanda para evitar dependências circulares
            const { updateCredentials } = await import('../services/authService');
            await updateCredentials(userId, { password: newPassword });
          } catch (e) {
            console.warn('Erro ao atualizar senha:', e);
            // mostra modal de erro para indicar problema
            setShowMissingFieldsModal(true);
            return;
          }
        }

        // atualiza detalhes (telefone, gênero, descrição) se houver algum valor
        const detailsPayload = {};
        if (phone && phone.trim().length > 0) detailsPayload.phone = phone.trim();
        if (gender && gender.trim().length > 0) {
          detailsPayload.gender = gender;
          const genderMap = {
            masculino: 1,
            feminino: 2,
            outro: 3,
            'nao-informar': 3,
          };
          const mapped = genderMap[gender];
          if (mapped) detailsPayload.userGenreId = mapped;
        }
        if (description && description.trim().length > 0) detailsPayload.description = description.trim();

        if (Object.keys(detailsPayload).length > 0) {
          try {
            const existingDetails = await getProfileDetails(userId).catch(() => ({}));
            const mergedDetails = { ...existingDetails, ...detailsPayload };
            Object.keys(mergedDetails).forEach(k => mergedDetails[k] === undefined && delete mergedDetails[k]);

            if (existingDetails && Object.keys(existingDetails).length > 0) {
              await updateProfileDetails(userId, mergedDetails);
            } else {
              // cria caso não existam detalhes
              await createProfileDetails(userId, mergedDetails);
            }
          } catch (e) {
            console.warn('Erro ao atualizar/mesclar detalhes do perfil:', e);
            // fallback: tenta atualizar com payload mínimo
            try { await updateProfileDetails(userId, detailsPayload); } catch (_) { }
          }
        }

        // persiste nome de exibição e foto localmente somente se fornecidos
        if (infoData.name) await AsyncStorage.setItem('userName', infoData.name);
        if (profileImage) await AsyncStorage.setItem('userPhoto', profileImage);

        setShowSuccessModal(true);
      } catch (e) {
        console.error('Erro saving profile:', e);
        setShowMissingFieldsModal(true);
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) setName(storedName);
        if (!userId) {
          setLoadingProfile(false);
          return;
        }

        // tenta carregar perfil
        try {
          const info = await getProfileInfo(userId);
          if (!mounted) return;
          if (info) {
            setName(info.name || storedName || '');
            setEmail(info.email || '');
            setProfileImage(info.photo || info.image || null);
          }

          // carrega detalhes se disponíveis
          try {
            const details = await getProfileDetails(userId);
            if (!mounted) return;
            if (details) {
              setPhone(details.phone || '');
              setGender(details.gender || 'feminino');
              setDescription(details.description || '');
            }
          } catch (e) {
            // ignora detalhes ausentes
          }
        } catch (e) {
          console.warn('Não foi possível carregar perfil:', e.message || e);
        }
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handlePhoneChange = (text) => {
    let rawText = text.replace(/\D/g, "");
    if (rawText.length > 11) rawText = rawText.substring(0, 11);

    let formattedPhone = "";
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
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      {/* FOTO */}
      <Text style={styles.labelPhoto}>Foto de perfil</Text>
      <TouchableOpacity style={styles.photoBox} onPress={handleImagePick}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/perfil sem foto.png")
          }
          style={styles.profileImage}
        />
        <View style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* SAUDAÇÃO */}
      <Text style={styles.greeting}>Olá, {name || 'usuário'}!</Text>

      {/* GÊNERO */}
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.genderRow}>
        {["masculino", "feminino", "outro", "nao-informar"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.genderOption}
            onPress={() => setGender(option)}
          >
            <View
              style={[
                styles.radioCircle,
                gender === option && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.genderText}>
              {option === "nao-informar"
                ? "Não informar"
                : option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CAMPOS */}
      <Text style={styles.label}>Celular</Text>
      <TextInput
        style={styles.input}
        placeholder="(XX) XXXXX-XXXX"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        maxLength={15}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira seu email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Nos fale mais sobre você..."
        placeholderTextColor="#999"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>

      {/* MODAL — CAMPOS FALTANDO */}
      <Modal visible={showMissingFieldsModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Por favor, preencha todos os campos obrigatórios.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonFilled}
                onPress={() => setShowMissingFieldsModal(false)}
              >
                <Text style={styles.modalButtonFilledText}>Entendi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL — SUCESSO */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Perfil atualizado com sucesso!
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonFilled}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalButtonFilledText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const textColorDark = "#333";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },
  labelPhoto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3d3d3dff",
    marginBottom: 5,
    textAlign: "center",
  },
  photoBox: {
    alignSelf: "center",
    width: 140,
    height: 140,
    borderRadius: 70,
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
    resizeMode: "cover",
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: secondaryColor,
    borderRadius: 20,
    padding: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: primaryPurple,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  genderText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 6,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: primaryPurple,
  },
  radioCircleSelected: {
    backgroundColor: primaryPurple,
  },
  saveButton: {
    backgroundColor: primaryPurple,
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "700",
    color: textColorDark,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },
  modalButtonFilled: {
    backgroundColor: secondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonFilledText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
