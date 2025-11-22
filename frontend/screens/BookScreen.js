import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const primaryPurple = "#B431F4";
const secundaryColor = "#a4dc22ff";
const { width } = Dimensions.get("window");

const BookScreen = ({ route, navigation }) => {

  const book = route?.params?.book || {
    id: 1,
    title: "Harry Potter e a Câmara Secreta",
    author: "J.K. Rowling",
    price: "R$ 35,00",
    images: [
      "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/91OINeHnJGL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/81iqZ2HHD-L._AC_UF894,1000_QL80_.jpg",
    ],
    genres: "Fantasia, aventura, magia",
    pages: 123,
    language: "Português",
    status: "Usado - 3 anos",
    description:
      "Na véspera do início das aulas, a estranha criatura Dobby aparece em seu quarto e o alerta sobre um grande perigo em Hogwarts.",
    isFavorite: false,
  };

  const [showDescription, setShowDescription] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(book.isFavorite); 

  const handleScroll = (event) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== currentImage) setCurrentImage(slide);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backButton}>
        <View style={styles.backCircle}>
          <Ionicons name="arrow-back" size={22} color={primaryPurple} />
        </View>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {book.images?.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.bookImage} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={30}
            color={secundaryColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dotsContainer}>
        {book.images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentImage === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.bookTitle}>{book.title}</Text>

        <View style={styles.authorContainer}>
          <View style={styles.purpleDot} />
          <Text style={styles.bookAuthor}>{book.author}</Text>
        </View>

        <Text style={styles.bookPrice}>{book.price}</Text>

        <TouchableOpacity
          onPress={() => setShowDescription(!showDescription)}
          style={styles.descriptionButton}
        >
          <Text style={styles.descriptionText}>Ver descrição ▼</Text>
        </TouchableOpacity>

        {showDescription && (
          <View style={styles.extraInfo}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Gêneros associados: </Text>{book.genres}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Número de páginas: </Text>{book.pages}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Idioma: </Text>{book.language}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Status: </Text>{book.status}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Descrição: </Text>{book.description}
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Eu quero</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Text style={styles.secondaryButtonText}>Adicionar à sacola</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sellerContainer}>
        <Text style={styles.sellerTitle}>Vendedor</Text>
        <View style={styles.sellerInfo}>
          <Image
            source={{
              uri: "https://i.pinimg.com/736x/77/3c/55/773c55acfc06b61c23234a4efc052b3a.jpg",
            }}
            style={styles.sellerImage}
          />
          <Text style={styles.sellerName}>Ana Lima</Text>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backCircle: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  imageWrapper: {
    position: "relative",
  },
  bookImage: {
    width: width,
    height: 600,
    resizeMode: "cover",
  },
  heartButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: secundaryColor, 
  },
  inactiveDot: {
    backgroundColor: primaryPurple,
  },
  detailsContainer: {
    padding: 20,
  },
  bookTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  purpleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: primaryPurple,
    marginRight: 6,
  },
  bookAuthor: {
    fontSize: 18,
    color: "#000",
  },
  bookPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 12,
  },
  descriptionButton: {
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: primaryPurple,
    fontWeight: "600",
  },
  extraInfo: {
    marginTop: 10,
    width: "100%",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  actionButtons: {
    marginTop: 20,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: primaryPurple,
    borderRadius: 30,
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
    borderColor: primaryPurple,
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: primaryPurple,
    fontSize: 16,
    fontWeight: "bold",
  },
  sellerContainer: {
    padding: 20,
  },
  sellerTitle: {
    fontSize: 16,
    color: primaryPurple,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8813cbff",
  },
  sellerName: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
});

export default BookScreen;
