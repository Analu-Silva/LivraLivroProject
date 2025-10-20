import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BookScreen = ({ route, navigation }) => {
  const { book } = route.params || {
    book: {
      title: "Harry Potter e a Câmara Secreta",
      author: "J.K. Rowling",
      price: "R$ 35,00",
      delivery: "Retirada na Biblioteca Municipal de Passo Fundo ou via correio",
      image: "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg", // exemplo
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header com botão voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack("Home")}>
          <Ionicons name="arrow-back" size={26} color="#B431F4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LIVRO</Text>
        <Ionicons name="heart-outline" size={26} color="#B431F4" />
      </View>

      {/* Imagem do livro */}
      <Image source={{ uri: book.image }} style={styles.bookImage} />

      {/* Informações do livro */}
      <View style={styles.detailsContainer}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>• {book.author}</Text>

        <Text style={styles.bookPrice}>{book.price}</Text>

        <Text style={styles.deliveryTitle}>Opções de entrega</Text>
        <Text style={styles.deliveryText}>{book.delivery}</Text>

        {/* Botão ver descrição */}
        <TouchableOpacity style={styles.descriptionButton}>
          <Text style={styles.descriptionText}>Ver descrição ▼</Text>
        </TouchableOpacity>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Eu quero</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Cart")}>
            <Text style={styles.secondaryButtonText}>Adicionar à sacola</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informações do vendedor */}
      <View style={styles.sellerContainer}>
        <Text style={styles.sellerTitle}>Vendedor</Text>
        <Text style={styles.sellerName}>Livraria Municipal</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 14,
    color: "#A3A3A3",
    fontWeight: "bold",
  },
  bookImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#777",
    marginTop: 2,
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  deliveryTitle: {
    fontSize: 14,
    color: "#B431F4",
    marginTop: 12,
    fontWeight: "600",
  },
  deliveryText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  descriptionButton: {
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#B431F4",
    fontWeight: "600",
  },
  actionButtons: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#B431F4",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderColor: "#B431F4",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#B431F4",
    fontSize: 16,
    fontWeight: "bold",
  },
  sellerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginTop: 10,
  },
  sellerTitle: {
    fontSize: 16,
    color: "#B431F4",
    fontWeight: "bold",
  },
  sellerName: {
    fontSize: 15,
    color: "#333",
    marginTop: 5,
  },
});

export default BookScreen;
