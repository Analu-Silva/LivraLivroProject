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
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";
const secundaryColor = "#A8F000";

const CartScreen = ({ navigation }) => {
  const cartItems = [
    {
      id: 1,
      title: "Harry Potter e a Câmara Secreta",
      price: 35.0,
      image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
      seller: "Ana Lima",
      sellerPhoto: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
      stars: 5,
    },
    {
      id: 2,
      title: "Oratória para Advogados e Estudantes",
      price: 35.0,
      image: "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
      seller: "Vítor Jaime",
      sellerPhoto: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
      stars: 4,
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <View style={styles.header}>
          <View style={styles.backButtonContainer}>
            <BackButton onPress={() => navigation.goBack()} />
          </View>
          <Text style={styles.headerTitle}>Sacola</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.bookImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.priceText}>R${item.price.toFixed(2)}</Text>
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.sellerContainer}>
                  <Image source={{ uri: item.sellerPhoto }} style={styles.sellerPhoto} />
                  <View>
                    <Text style={styles.sellerName}>{item.seller}</Text>
                    <View style={styles.starsContainer}>
                      {[...Array(item.stars)].map((_, index) => (
                        <Ionicons key={index} name="star" size={15} color={primaryPurple} />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="add" size={45} color={primaryPurple} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            R$ {total.toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingTop: 20 },
  contentArea: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 30, marginBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: primaryPurple, marginLeft: 10 },
  card: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 15, padding: 10, marginBottom: 15 },
  bookImage: { width: 155, height: 149, borderRadius: 10 },
  infoContainer: { flex: 1, marginTop: -10, marginLeft: 12, justifyContent: "center" },
  priceText: { fontSize: 28, fontWeight: "bold", color: "#000" },
  titleText: { fontSize: 15, color: "#333", marginTop: 3 },
  sellerContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  sellerPhoto: { width: 26, height: 26, borderRadius: 13, marginRight: 6 },
  sellerName: { fontSize: 12, color: primaryPurple, fontWeight: "600" },
  starsContainer: { flexDirection: "row" },
  addButton: {
    borderWidth: 2,
    borderColor: primaryPurple,
    borderStyle: "dashed",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 155,
    height: 149,
    marginLeft: 10,
    marginVertical: 10,
  },
  footer: {
    backgroundColor: "#FFF",
    paddingVertical: 25,
    paddingHorizontal: 25,
    marginTop: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  footerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#000" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#000" },
  buyButton: {
    backgroundColor: primaryPurple,
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    alignSelf: "center",
  },
  buyText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
