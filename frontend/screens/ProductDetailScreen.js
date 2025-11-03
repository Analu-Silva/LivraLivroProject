import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

export default function ProductDetailScreen() {
  const route = useRoute();
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `https://fakestoreapi.com/products/${id}`
      );
      const data = response.data;
      setProduct(data);
    } catch (error) {
      Alert.alert("Erro", "ocorreu um erro, tente novamente mais tarde");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9b59b6" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
      </View>
    );
  }

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

      <View style={styles.content}>
        <Image
          source={{
            uri: product.image,
          }}
          style={styles.productImage}
        />

        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Categoria:</Text>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Descrição:</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e6f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4e6f7",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4e6f7",
  },
  errorText: {
    fontSize: 18,
    color: "#9b59b6",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  productImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#563863",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productInfo: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#563863",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9b59b6",
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize",
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: primaryPurple,
    textAlign: "center",
    marginBottom: 20,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9b59b6",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    textAlign: "justify",
  },
});
