import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";
const successGreen = "#a4dc22ff"; 

const PurchaseScreen = ({ navigation }) => {
  const [payment, setPayment] = useState("Pix");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const cartItems = [
    {
      id: 1,
      title: "Harry Potter e a Câmara Secreta",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: 2,
      title: "Oratória para Advogados e Estudantes",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
    },
  ];

  const frete = 10;
  const totalLivros = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = totalLivros + frete;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Compra</Text>
        </View>

        {/* Itens */}
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.priceText}>R${item.price.toFixed(2)}</Text>
              <Text style={styles.titleText} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </View>
        ))}

        {/* Método de pagamento */}
        <Text style={styles.sectionTitle}>Método de pagamento</Text>
        <View style={styles.paymentOptions}>
          {["Pix", "Cartão", "Boleto"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.paymentOption}
              onPress={() => setPayment(option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  payment === option && styles.radioSelected,
                ]}
              />
              <Text style={styles.paymentText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Endereço */}
        <Text style={styles.sectionTitle}>Endereço de entrega</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            Rua Paraná 320, Passo Fundo, RS, 12345678, Brasil
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Endereco")}
          >
            <Text style={styles.changeAddressText}>
              Alterar endereço de entrega
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Livros</Text>
            <Text style={styles.footerValue}>
              R$ {totalLivros.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Frete</Text>
            <Text style={styles.footerValue}>
              R$ {frete.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setShowSuccessModal(true)}
        >
          <Text style={styles.confirmText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>

      {/* POP-UP DE SUCESSO COM CORAÇÃO INLINE */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>

            {/* TEXTO + CORAÇÃO INLINE */}
            <Text style={styles.modalMessageText}>
              Compra realizada com sucesso! Obrigada por usar o nosso aplicativo{" "}
              <Ionicons name="heart" size={20} color={successGreen} />
            </Text>

            {/* Botão verde */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                setTimeout(() => {
                  navigation.navigate("Home");
                }, 300);
              }}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PurchaseScreen;


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
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, 
  },
  bookImage: { width: 98, height: 94, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 10 },
  priceText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  titleText: { fontSize: 17, color: "#333", marginTop: 2 },

  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 5,
    color: "#000",
    paddingLeft: 10,
  },

  paymentOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 12,
    gap: 55,
    paddingLeft: 10,
  },
  paymentOption: { flexDirection: "row", alignItems: "center", gap: 8 },
  paymentText: { fontSize: 20, color: "#000" },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: primaryPurple,
  },
  radioSelected: {
    backgroundColor: primaryPurple,
  },

  addressContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingLeft: 10,
  },
  addressText: {
    fontSize: 17,
    color: "#000",
    lineHeight: 20,
  },
  changeAddressText: {
    color: primaryPurple,
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },

  footer: {
    backgroundColor: "#FFF",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  footerTop: { marginBottom: 15 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  footerLabel: { fontSize: 17, color: "#000" },
  footerValue: { fontSize: 17, color: "#000" },
  footerTotalLabel: { fontSize: 19, fontWeight: "bold", color: "#000" },
  footerTotalValue: { fontSize: 19, fontWeight: "bold", color: "#000" },

  confirmButton: {
    backgroundColor: primaryPurple,
    width: 181,
    height: 41,
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalMessageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  inlineMessage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  modalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: successGreen,
    width: 160,
    height: 45,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
