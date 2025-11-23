import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getBookById } from "../services/bookService";
import { addToCart } from "../services/cartService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const primaryPurple = "#B431F4";
const secundaryColor = "#a4dc22ff";
const { width } = Dimensions.get("window");

const BookScreen = ({ route, navigation }) => {
  const bookId = route?.params?.bookId;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (bookId) {
      loadBook();
    } else {
      setLoading(false);
    }
  }, [bookId]);

  const loadBook = async () => {
    try {
      setLoading(true);
      if (!bookId) {
        console.log('BookID não fornecido');
        throw new Error('ID do livro não fornecido');
      }

      console.log('Carregando livro com ID:', bookId);
      const bookData = await getBookById(bookId);
      console.log('Livro carregado:', bookData);

      // Formata dados do livro
      const formattedBook = {
        id: bookData.id,
        title: bookData.title || 'Sem título',
        author: bookData.author || 'Autor desconhecido',
        price: `R$ ${Number(bookData.price).toFixed(2)}`,
        priceNumber: Number(bookData.price),
        images: bookData.imagesUrls && Array.isArray(bookData.imagesUrls) 
          ? bookData.imagesUrls.map(img => img.imageUrl)
          : [],
        genres: bookData.genre && Array.isArray(bookData.genre)
          ? bookData.genre.map(g => g.genre).join(', ')
          : 'Sem gênero',
        pages: bookData.numberOfPages || 0,
        status: bookData.bookCondition 
          ? (bookData.bookCondition.id === 2 ? 'Novo' : 'Usado') + (bookData.numberOfYears ? ` - ${bookData.numberOfYears} anos` : '')
          : 'Status desconhecido',
        description: bookData.description || 'Sem descrição disponível',
        seller: bookData.seller,
        isFavorite: false,
      };

      setBook(formattedBook);
    } catch (error) {
      console.error('Erro ao carregar livro:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do livro');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== currentImage) setCurrentImage(slide);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar itens ao carrinho');
        return;
      }

      await addToCart(book.id, 1);
      Alert.alert('Sucesso', 'Livro adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o livro ao carrinho');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryPurple} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Livro não encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <View style={styles.backCircle}>
          <Ionicons name="arrow-back" size={22} color={primaryPurple} />
        </View>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        {book.images && book.images.length > 0 ? (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {book.images.map((img, index) => (
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
          </>
        ) : (
          <View style={[styles.bookImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
      </View>

      {book.images && book.images.length > 0 && (
        <View style={styles.dotsContainer}>
          {book.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentImage === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}

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
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Compra')}
          >
            <Text style={styles.primaryButtonText}>Eu quero</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, addingToCart && styles.disabledButton]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator color={primaryPurple} />
            ) : (
              <Text style={styles.secondaryButtonText}>Adicionar à sacola</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sellerContainer}>
        <Text style={styles.sellerTitle}>Vendedor</Text>
        <View style={styles.sellerInfo}>
          <View style={styles.sellerImage}>
            <Text style={styles.sellerImageText}>?</Text>
          </View>
          <Text style={styles.sellerName}>{book.author}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
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
  backButtonText: {
    color: primaryPurple,
    fontWeight: "bold",
  },
  imageWrapper: {
    position: "relative",
  },
  bookImage: {
    width: width,
    height: 600,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 14,
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
  disabledButton: {
    opacity: 0.5,
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
    backgroundColor: primaryPurple,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerImageText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  sellerName: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
});

export default BookScreen;