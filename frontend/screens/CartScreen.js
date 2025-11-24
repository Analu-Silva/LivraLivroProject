import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

      const formattedItems = cartData.items && Array.isArray(cartData.items)
        ? cartData.items.map(item => {
            const book = item.book || item.bookDto || item.bookEntity || item.bookEntity?.book || item.book?.book || {};

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

            const sellerName = item.sellerName || item.seller?.name || book.sellerName || book.seller?.name || book.profile?.name || book.author || book.user?.name || 'Vendedor desconhecido';

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
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      setShowErrorModal(true);
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })} />
          <Text style={styles.headerTitle}>Sacola</Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Sua sacola está vazia</Text>
            <TouchableOpacity style={styles.continueShoppingButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.continueShoppingText}>Continuar comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
          
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
                  <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} disabled={removing === item.id}>
                    <Text style={styles.removeText}>
                      {removing === item.id ? 'Removendo...' : 'Remover'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          </>
        )}
      </ScrollView>

        {/* Modal Sucesso */}



      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sucesso</Text>
            <Text style={styles.modalText}>Item removido do carrinho</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal Erro */}
      <Modal transparent visible={showErrorModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, { color: '#b00020' }]}>Erro</Text>
            <Text style={styles.modalText}>Não foi possível remover o item</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowErrorModal(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#FFF",paddingTop:20},

  modalOverlay:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center'
  },

  modalCard:{
    backgroundColor:'#FFF',
    padding:20,
    borderRadius:15,
    width:'80%',
    alignItems:'center'

  },
  modalTitle:{
    fontSize:18,
    fontWeight:'bold',
    color:primaryPurple,
    marginBottom:10
  },

  modalText:{
    fontSize:14,
    textAlign:'center',
    marginBottom:20
  },

  modalButton:{
    backgroundColor:primaryPurple,
    paddingHorizontal:25,
    paddingVertical:8,
    borderRadius:20
  },

  modalButtonText:{
    color:'#FFF',
    fontWeight:'bold'
  }
});