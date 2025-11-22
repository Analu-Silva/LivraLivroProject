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

const CartScreen = ({ navigation }) => {
  const cartItems = [
    {
      id: 1,
      title: "Harry Potter e a Câmara Secreta",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
      seller: "Ana Lima",
      sellerPhoto: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
      stars: 5,
    },
    {
      id: 2,
      title: "Oratória para Advogados e Estudantes",
      price: 35.0,
      image:
        "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
      seller: "Vítor Jaime",
      sellerPhoto: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
      stars: 4,
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Sacola</Text>
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
                        size={15}
                        color={primaryPurple}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Adicionar mais */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="add" size={45} color={primaryPurple} />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerValue}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate("Compra")}
          >
            <Text style={styles.buyText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartScreen;

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
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 20, 
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  bookImage: { width: 98, height: 94, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 10, justifyContent: "center" },
  priceText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  titleText: { fontSize: 17, color: "#333", marginTop: 2 },
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
    width: 98,
    height: 94,
    marginHorizontal: 20,
    marginVertical: 10,
    alignSelf: "flex-start",
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
  footerLabel: { fontSize: 19, fontWeight: "bold", color: "#000" },
  footerValue: { fontSize: 19, fontWeight: "bold", color: "#000" },
  buyButton: {
    backgroundColor: primaryPurple,
    width: 181,
    height: 41,
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buyText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
