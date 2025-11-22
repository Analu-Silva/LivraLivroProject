import React, { useState } from "react";
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

  // ✅ Modais
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleImagePick = () => {
    setShowSuccessModal(true); // só pra exemplo, você troca depois
  };

  const handleSave = () => {
    if (!phone || !email) {
      setShowMissingFieldsModal(true);
      return;
    }
    setShowSuccessModal(true);
  };

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
      <Text style={styles.greeting}>Olá, Priscila!</Text>

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
