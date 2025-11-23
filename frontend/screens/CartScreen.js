import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import { getCart, removeCartItem } from "../services/cartService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const primaryPurple = "#B431F4";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCart();
    });

    return unsubscribe;
  }, [navigation]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        console.log('Usuário não logado, carrinho vazio');
        setCartItems([]);
        return;
      }

      const cartData = await getCart('BRL');
      console.log('Carrinho carregado:', cartData);

      // Formata dados do carrinho
      const formattedItems = cartData.items && Array.isArray(cartData.items)
        ? cartData.items.map(item => {
            const book = item.book || item.bookDto || item.bookEntity || item.bookEntity?.book || item.book?.book || {};

            // Extrai imagem de forma tolerante: aceita string ou objeto
            let image = null;
            const imgArr = book.imagesUrls || book.imagesUrl || book.images || book.imageUrls || book.image || book.coverImages || book.photos;
            if (Array.isArray(imgArr) && imgArr.length > 0) {
              const first = imgArr[0];
              if (typeof first === 'string') image = first;
              else if (first && (first.imageUrl || first.url)) image = first.imageUrl || first.url;
              else if (first && first.secure_url) image = first.secure_url;
            } else if (typeof imgArr === 'string') {
              image = imgArr;
            }

            // Extrai nome do vendedor de várias possíveis propriedades
            const sellerName = item.sellerName || item.seller?.name || book.sellerName || book.seller?.name || book.profile?.name || book.author || book.user?.name || 'Vendedor desconhecido';

            // tenta extrair foto do vendedor se disponível
            let sellerPhoto = null;
            if (book.sellerPhoto) sellerPhoto = book.sellerPhoto;
            else if (book.profile && (book.profile.photo || book.profile.image)) sellerPhoto = book.profile.photo || book.profile.image;
            else if (item.seller && (item.seller.photo || item.seller.image)) sellerPhoto = item.seller.photo || item.seller.image;

            return {
              id: item.id,
              bookId: book.id,
              title: book.title || 'Sem título',
              price: Number(book.price) || 0,
              image,
              seller: sellerName,
              sellerPhoto,
              stars: 5,
              quantity: item.quantity || 1,
            };
          })
        : [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setRemoving(itemId);
      await removeCartItem(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      Alert.alert('Sucesso', 'Item removido do carrinho');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      Alert.alert('Erro', 'Não foi possível remover o item');
    } finally {
      setRemoving(null);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Sacola</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryPurple} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} />
          <Text style={styles.headerTitle}>Sacola</Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sua sacola está vazia</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.continueShoppingText}>Continuar comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Itens */}
            {cartItems.map((item) => (
              <View key={item.id} style={styles.card}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.bookImage} />
                ) : (
                  <View style={[styles.bookImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>Sem imagem</Text>
                  </View>
                )}
                <View style={styles.infoContainer}>
                  <Text style={styles.priceText}>R${item.price.toFixed(2)}</Text>
                  <Text style={styles.titleText} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.sellerContainer}>
                    <View style={styles.sellerPhoto}>
                      <Text style={styles.sellerPhotoText}>?</Text>
                    </View>
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
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.id)}
                    disabled={removing === item.id}
                  >
                    <Text style={styles.removeText}>
                      {removing === item.id ? 'Removendo...' : 'Remover'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Adicionar mais */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="add" size={45} color={primaryPurple} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      {cartItems.length > 0 && (
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
              onPress={() => navigation.navigate("Compra", { cartItems, total })}
            >
              <Text style={styles.buyText}>Comprar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  bookImage: { 
    width: 98, 
    height: 94, 
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  infoContainer: { 
    flex: 1, 
    marginLeft: 10, 
    justifyContent: "center" 
  },
  priceText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#000" 
  },
  titleText: { 
    fontSize: 17, 
    color: "#333", 
    marginTop: 2 
  },
  sellerContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 8 
  },
  sellerPhoto: { 
    width: 26, 
    height: 26, 
    borderRadius: 13,
    backgroundColor: primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6 
  },
  sellerPhotoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sellerName: { 
    fontSize: 12, 
    color: primaryPurple, 
    fontWeight: "600" 
  },
  starsContainer: { 
    flexDirection: "row" 
  },
  removeText: {
    fontSize: 12,
    color: '#b00020',
    marginTop: 4,
    fontWeight: '600',
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: primaryPurple,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  continueShoppingText: {
    color: '#FFF',
    fontWeight: '600',
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
  footerTop: { 
    marginBottom: 15 
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  footerLabel: { 
    fontSize: 19, 
    fontWeight: "bold", 
    color: "#000" 
  },
  footerValue: { 
    fontSize: 19, 
    fontWeight: "bold", 
    color: "#000" 
  },
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
  buyText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});