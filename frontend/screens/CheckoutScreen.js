import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import { createOrder } from "../services/orderService";
import { getAddress } from "../services/addressService";
import { clearCart } from "../services/cartService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const primaryPurple = "#B431F4";
const successGreen = "#a4dc22ff"; 

const CheckoutScreen = ({ route, navigation }) => {
  const cartData = route?.params || {};
  const cartItems = cartData.cartItems || [];
  const cartTotal = cartData.total || 0;

  const [payment, setPayment] = useState("Pix");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [address, setAddress] = useState({
    street: "Rua Paraná",
    number: "320",
    city: "Passo Fundo",
    state: "RS",
    zipCode: "12345678",
    country: "Brasil",
  });

  const frete = 10;
  const totalLivros = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = totalLivros + frete;

  // Se não houver itens, redireciona
  useEffect(() => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens ao carrinho antes de prosseguir');
      navigation.goBack();
    }
  }, []);

  // load saved delivery address from profile
  useEffect(() => {
    let mounted = true;

    const loadAddr = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const addr = await getAddress(userId);
        if (!mounted) return;
        if (addr) {
          setAddress({
            street: addr.street || address.street,
            number: addr.number ? String(addr.number) : address.number,
            city: addr.city || address.city,
            state: addr.state || address.state,
            zipCode: addr.zipCode || address.zipCode || addr.cep || '',
            country: addr.country || address.country || 'Brasil',
          });
        }
      } catch (e) {
        console.warn('Não foi possível carregar endereço do perfil:', e);
      }
    };

    // initial load
    loadAddr();

    // reload when screen focused (e.g., after editing address)
    const unsubscribe = navigation.addListener('focus', () => {
      loadAddr();
    });

    return () => { mounted = false; unsubscribe(); };
  }, [navigation]);

  const handleConfirmOrder = async () => {
    try {
      setCreatingOrder(true);

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Erro', 'Você precisa estar logado para fazer um pedido');
        return;
      }

      // Mapear método de pagamento para o campo esperado pelo backend
      const paymentMapping = {
        Pix: 1,
        'Cartão': 2,
        Boleto: 3,
      };

      const paymentMethodId = paymentMapping[payment] || null;

      // Prepara dados do pedido
      const orderData = {
        userId,
        items: cartItems.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity,
          price: item.price,
        })),
        // inclui ambos os campos: legível e o id exigido pelo backend
        paymentMethod: payment,
        paymentMethodId,
        deliveryAddress: {
          street: address.street,
          number: address.number,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
        totalAmount: total,
        status: 'PENDENTE',
      };

      console.log('Criando pedido:', orderData);

      // Cria pedido
      const result = await createOrder(orderData);
      console.log('Pedido criado:', result);

      // Limpa carrinho
      try {
        await clearCart();
      } catch (e) {
        console.warn('Erro ao limpar carrinho:', e);
      }

      // Mostra modal de sucesso
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      Alert.alert('Erro', 'Não foi possível confirmar o pedido. Tente novamente.');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.navigate('Sacola')} />
          <Text style={styles.headerTitle}>Compra</Text>
        </View>

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
              <Text style={styles.quantityText}>Qtd: {item.quantity}</Text>
            </View>
          </View>
        ))}

        {/* Método de pagamento */}
        <Text style={styles.sectionTitle}>Método de pagamento</Text>
        <View style={styles.paymentOptions}>
          {["Pix", "Cartão", "Boleto"].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.paymentOption}
              onPress={() => setPayment(option)}
            >
              <View
                style={[
                  styles.radioCircle,
                  payment === option && styles.radioSelected,
                ]}
              />
              <Text style={styles.paymentText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Endereço */}
        <Text style={styles.sectionTitle}>Endereço de entrega</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>
            {address.street} {address.number}, {address.city}, {address.state}, {address.zipCode}, {address.country}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Endereco')}
          >
            <Text style={styles.changeAddressText}>
              Alterar endereço de entrega
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Livros</Text>
            <Text style={styles.footerValue}>
              R$ {totalLivros.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Frete</Text>
            <Text style={styles.footerValue}>
              R$ {frete.toFixed(2).replace(".", ",")}
            </Text>
          </View>
          <View style={styles.footerRow}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>
              R$ {total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, creatingOrder && styles.disabledButton]}
          onPress={handleConfirmOrder}
          disabled={creatingOrder}
        >
          {creatingOrder ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de Sucesso */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalMessageText}>
              Compra realizada com sucesso! Obrigada por usar o nosso aplicativo{" "}
              <Ionicons name="heart" size={20} color={successGreen} />
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                setTimeout(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }],
                  });
                }, 300);
              }}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutScreen;

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
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 20,
    paddingLeft: 10,
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
    marginLeft: 10 
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
  quantityText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 5,
    color: "#000",
    paddingLeft: 10,
  },
  paymentOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 12,
    gap: 55,
    paddingLeft: 10,
  },
  paymentOption: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  paymentText: { 
    fontSize: 20, 
    color: "#000" 
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: primaryPurple,
  },
  radioSelected: {
    backgroundColor: primaryPurple,
  },
  addressContainer: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingLeft: 10,
  },
  addressText: {
    fontSize: 17,
    color: "#000",
    lineHeight: 20,
  },
  changeAddressText: {
    color: primaryPurple,
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
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
    fontSize: 17, 
    color: "#000" 
  },
  footerValue: { 
    fontSize: 17, 
    color: "#000" 
  },
  footerTotalLabel: { 
    fontSize: 19, 
    fontWeight: "bold", 
    color: "#000" 
  },
  footerTotalValue: { 
    fontSize: 19, 
    fontWeight: "bold", 
    color: "#000" 
  },
  confirmButton: {
    backgroundColor: primaryPurple,
    width: 181,
    height: 41,
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalMessageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: successGreen,
    width: 160,
    height: 45,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});