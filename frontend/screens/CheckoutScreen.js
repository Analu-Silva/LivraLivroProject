import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = ({ navigation }) => {
    const [payment, setPayment] = useState("Pix");

  const items = [
    {
      id: 1,
      title: "Harry Potter e a Câmara Secreta",
      price: 35.0,
      image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: 2,
      title: "Oratória para Advogados e Estudantes",
      price: 35.0,
      image: "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
    },
  ];

  const subtotal = 70;
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#B431F4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compra</Text>
      </View>

      {/* Itens */}
      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookPrice}>R$ {item.price.toFixed(2)}</Text>
          </View>
        </View>
      ))}

      {/* Métodos de pagamento */}
      <Text style={styles.sectionTitle}>Método de pagamento</Text>
      <View style={styles.paymentOptions}>
        {["Pix", "Cartão", "Boleto"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.paymentButton,
              payment === option && styles.paymentSelected,
            ]}
            onPress={() => setPayment(option)}
          >
            <Text
              style={[
                styles.paymentText,
                payment === option && styles.paymentTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Endereço */}
      <Text style={styles.sectionTitle}>Endereço de entrega</Text>
      <Text style={styles.address}>
        Rua Paraná 230, Passo Fundo, RS, 12345678, Brasil
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Address")}>
        <Text style={styles.changeAddress}>Alterar endereço de entrega</Text>
      </TouchableOpacity>

      {/* Resumo */}
      <View style={styles.summary}>
        <Text>Livros</Text>
        <Text>R$ {subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.summary}>
        <Text>Frete</Text>
        <Text>R$ {shipping.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryTotal}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalPrice}>R$ {total.toFixed(2)}</Text>
      </View>

      {/* Botão confirmar */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF", 
    padding: 20 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#B431F4", 
    marginLeft: 10 
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F7F2FB",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  bookImage: { 
    width: 70, 
    height: 90, 
    borderRadius: 10 
  },
  bookInfo: { 
    marginLeft: 15, 
    flex: 1 
  },
  bookTitle: { 
    fontSize: 15, 
    fontWeight: "600" 
  },
  bookPrice: { 
    color: "#000", 
    fontWeight: "bold", 
    marginTop: 5 
  },
  sectionTitle: { 
    color: "#B431F4", 
    fontWeight: "bold", 
    marginTop: 15 
  },
  paymentOptions: { 
    flexDirection: "row", 
    marginTop: 10 
  },
  paymentButton: {
    borderWidth: 1,
    borderColor: "#B431F4",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  paymentSelected: {
    backgroundColor: "#B431F4",
  },
  paymentText: { 
    color: "#B431F4" 
  },
  paymentTextSelected: { 
    color: "#FFF" 
  },
  address: { 
    marginTop: 10, 
    color: "#333" 
  },
  changeAddress: { 
    color: "#B431F4", 
    marginTop: 5 
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  totalText: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  totalPrice: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  confirmButton: {
    backgroundColor: "#B431F4",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  confirmText: { 
    color: "#FFF", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});

export default CheckoutScreen;
