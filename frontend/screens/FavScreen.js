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

const FavoritosScreen = ({ navigation }) => {
  const favoriteItems = [
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
    {
      id: 3,
      title: "Black Notice - Patricia Cornwell",
      price: 30.5,
      image:
        "https://m.media-amazon.com/images/I/81Zg7bOitvL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: 4,
      title: "Um Menos Certo",
      price: 21.0,
      image:
        "https://m.media-amazon.com/images/I/71uRfAQw6zL._AC_UF894,1000_QL80_.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {/* Lista de favoritos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.grid}>
          {favoriteItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.bookImage} />
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Botão circular de adicionar */}
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="add" size={32} color={primaryPurple} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FavoritosScreen;

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
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 80,
    paddingHorizontal: 20, 
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: "#FFF",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  bookImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: primaryPurple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    alignSelf: "center",
  },
});
