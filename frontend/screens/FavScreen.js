import React, { useEffect, useState } from "react";
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
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { content, items } = await import("../services/wishlistService").then((m) => m.getWishlistItemsPaginated(0, 50, "id,asc", "BRL"));
        const list = Array.isArray(content)
          ? content
          : Array.isArray(items)
          ? items
          : Array.isArray(content?.content)
          ? content.content
          : [];
        if (!mounted) return;

        const normalized = (list || []).map((it) => {
          const book = it.book || it.bookDto || it.bookEntity || null;
          let image = null;
          const imgArr = book && (book.imagesUrls || book.imagesUrl || book.images || book.imageUrls || book.image || book.coverImages || book.photos);
          if (Array.isArray(imgArr) && imgArr.length > 0) {
            const first = imgArr[0];
            if (typeof first === "string") image = first;
            else if (first && (first.imageUrl || first.url)) image = first.imageUrl || first.url;
            else if (first && first.secure_url) image = first.secure_url;
          } else if (typeof imgArr === "string") image = imgArr;

          const sellerName = it.sellerName || it.seller?.name || book?.sellerName || book?.seller?.name || book?.profile?.name || book?.user?.name || "Vendedor desconhecido";
          let sellerPhoto = null;
          if (book?.sellerPhoto) sellerPhoto = book.sellerPhoto;
          else if (book?.profile && (book.profile.photo || book.profile.image)) sellerPhoto = book.profile.photo || book.profile.image;
          else if (it.seller && (it.seller.photo || it.seller.image)) sellerPhoto = it.seller.photo || it.seller.image;

          return {
            id: it.id || (book && book.id) || Math.random().toString(36).slice(2, 9),
            title: (book && (book.title || book.name)) || it.title || "Sem título",
            price: (book && (Number(book.price) || Number(it.price))) || Number(it.price) || 0,
            image,
            seller: sellerName,
            sellerPhoto,
          };
        });

        setFavoriteItems(normalized);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        setFavoriteItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.grid}>
          {favoriteItems.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.bookImage} />
              ) : (
                <View style={[styles.bookImage, { justifyContent: "center", alignItems: "center" }]}> 
                  <Text style={{ color: "#999" }}>Sem imagem</Text>
                </View>
              )}
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>R$ {item.price.toFixed(2).replace(".", ",")}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.circleButton} onPress={() => navigation.navigate("Home")}>
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
