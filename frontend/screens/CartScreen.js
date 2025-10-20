import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartScreen = ({ navigation }) => {
  const cartItems = [
    {
      id: 1,
      title: "Harry Potter e a Câmara Secreta",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
      seller: "Ana Lima",
      sellerPhoto:
        "https://cdn-icons-png.flaticon.com/512/219/219969.png", // exemplo
      stars: 5,
    },
    {
      id: 2,
      title: "Oratória para Advogados e Estudantes",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
      seller: "Vítor Jaime",
      sellerPhoto:
        "https://cdn-icons-png.flaticon.com/512/219/219983.png", // exemplo
      stars: 4,
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
        <Text style={styles.headerTitle}>Sacola</Text>
      </View>

      {/* Lista */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.priceText}>R${item.price.toFixed(2)}</Text>
              <Text style={styles.titleText}>{item.title}</Text>
              <View style={styles.sellerContainer}>
                <Image
                  source={{ uri: item.sellerPhoto }}
                  style={styles.sellerPhoto}
                />
                <View>
                  <Text style={styles.sellerName}>{item.seller}</Text>
                  <View style={styles.starsContainer}>
                    {[...Array(item.stars)].map((_, index) => (
                      <Ionicons
                        key={index}
                        name="star"
                        size={12}
                        color="#B431F4"
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Botão Adicionar */}
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={40} color="#B431F4" />
        </TouchableOpacity>
      </ScrollView>

      {/* Rodapé */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("Compra")}
        >
          <Text style={styles.buyText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#B431F4",
    marginLeft: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookImage: {
    width: 80,
    height: 100,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  titleText: {
    fontSize: 14,
    color: "#333",
    marginTop: 3,
  },
  sellerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  sellerPhoto: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 6,
  },
  sellerName: {
    fontSize: 12,
    color: "#B431F4",
    fontWeight: "600",
  },
  starsContainer: {
    flexDirection: "row",
  },
  addButton: {
    borderWidth: 2,
    borderColor: "#DAB8F7",
    borderStyle: "dashed",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    marginVertical: 10,
  },
  footer: {
    backgroundColor: "#FFF",
    paddingTop: 10,
    paddingBottom: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  buyButton: {
    backgroundColor: "#B431F4",
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B431F4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buyText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
