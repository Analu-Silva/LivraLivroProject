import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import { useAuth } from "../contexts/AuthContext";
import { deleteAccount } from "../services/authService";

const primaryColor = "#B431F4";
const secundaryColor = "#a4dc22ff";
const textColorDark = "#333";
const dangerColor = "#FF4444";

export default function MenuScreen({ navigation }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { logout, user } = useAuth();

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "PreHome" }],
    });
  };

  const confirmDelete = async () => {
    if (!user?.userId) {
      Alert.alert("Erro", "Usuário não encontrado");
      setShowDeleteModal(false);
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(user.userId);
      await logout();
      setShowDeleteModal(false);
      
      Alert.alert("Sucesso", "Conta excluída com sucesso", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: "PreHome" }],
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      Alert.alert("Erro", "Não foi possível excluir a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.navigate("Home")} />
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      {/* LISTA */}
      <View style={styles.menuList}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text style={styles.menuItemText}>Configurações</Text>
          <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Sacola")}
        >
          <Text style={styles.menuItemText}>Sacola</Text>
          <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Vendas")}
        >
          <Text style={styles.menuItemText}>Suas vendas</Text>
          <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Pedidos")}
        >
          <Text style={styles.menuItemText}>Seus pedidos</Text>
          <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.menuItemText}>Sair</Text>
          <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemLast]}
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={styles.menuItemTextDanger}>Excluir conta</Text>
          <Feather name="chevron-right" size={20} color={dangerColor} />
        </TouchableOpacity>
      </View>

      {/* === MODAIS === */}
      {/* EXCLUIR CONTA */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Certeza que deseja excluir sua conta?
            </Text>
            <Text style={styles.modalSubText}>
              Todos seus dados serão perdidos.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonFilled}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonFilledText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonOutline}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonOutlineText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SAIR */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Deseja sair da sua conta?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonFilled}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonFilledText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButtonOutline}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonOutlineText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryColor,
    marginLeft: 10,
  },
  menuList: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 25, 
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 18,
    color: textColorDark,
  },
  menuItemTextDanger: {
    fontSize: 18,
    color: dangerColor,
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
  modalSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },
  modalButtonFilled: {
    backgroundColor: secundaryColor,
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
  modalButtonOutline: {
    borderWidth: 2,
    borderColor: secundaryColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonOutlineText: {
    color: secundaryColor,
    fontWeight: "700",
    fontSize: 16,
  },
});
