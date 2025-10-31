import React, { useState, useEffect } from "react";
import {
View,
Text,
FlatList,
TouchableOpacity,
StyleSheet,
ActivityIndicator,
Image,
SafeAreaView,
ScrollView,
Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const genericBookImage = require('../assets/livro.jpg');
const logo = require('../assets/logo.png');

const primaryPurple = '#B431F4';
const secondaryColor = '#A8F000';
const textColorDark = '#333';
const greyBackground = '#f0f2f5';

// Dados de exemplo para os livros em destaque
const featuredBooks = [
{ id: 'book-1', image: genericBookImage, price: 35.00 },
{ id: 'book-2', image: genericBookImage, price: 35.00 },
{ id: 'book-3', image: genericBookImage, price: 30.00 },
{ id: 'book-4', image: genericBookImage, price: 35.00 },
{ id: 'book-5', image: genericBookImage, price: 35.00 },
{ id: 'book-6', image: genericBookImage, price: 30.00 },
];

export default function PreHomeScreen() {
const [loading, setLoading] = useState(true);
const [showLoginModal, setShowLoginModal] = useState(false);
const navigation = useNavigation();

useEffect(() => {
// Simula carregamento
setTimeout(() => {
    setLoading(false);
    // Abre o modal automaticamente após carregar
    setTimeout(() => {
    setShowLoginModal(true);
    }, 500);
}, 1000);
}, []);

useEffect(() => {
navigation.setOptions({
    headerShown: false,
});
}, [navigation]);

const formatPrice = (price) => {
return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

const handleBookPress = () => {
// Abre o modal ao clicar em qualquer livro
setShowLoginModal(true);
};

const handleCreateAccount = () => {
setShowLoginModal(false);
navigation.navigate('Register');
};

const handleLogin = () => {
setShowLoginModal(false);
navigation.navigate('Login');
};

const handleNotNow = () => {
setShowLoginModal(false);
// Permanece na PreHome (pode navegar para Home se preferir)
};

const renderBookCard = ({ item }) => (
<TouchableOpacity
    style={styles.bookCard}
    onPress={handleBookPress}
>
    <Image source={item.image} style={styles.bookCover} />
    <View style={styles.priceContainer}>
    <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
    </View>
</TouchableOpacity>
);

if (loading) {
return (
    <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={primaryPurple} />
    </View>
);
}

return (
<SafeAreaView style={styles.safeArea}>
    <View style={styles.appContainer}>

    {/* Header simples com logo */}
    <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
    </View>

    {/* Título */}
    <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Bem-vindo ao LivraLivro!</Text>
        <Text style={styles.subtitle}>Explore nossos livros em destaque</Text>
    </View>

    {/* Content Scrollable Area */}
    <ScrollView style={styles.contentScrollable}>
        <View style={styles.bookSection}>
        <Text style={styles.sectionTitle}>Para você</Text>
        <FlatList
            data={featuredBooks}
            renderItem={renderBookCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookCardsRow}
        />
        </View>

        <View style={styles.bookSection}>
        <Text style={styles.sectionTitle}>Mais populares</Text>
        <FlatList
            data={featuredBooks}
            renderItem={renderBookCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookCardsRow}
        />
        </View>
    </ScrollView>

    {/* MODAL DE LOGIN */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
    >
        <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowLoginModal(false)}
        >
        <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
        >
            <View style={styles.modalContainer}>
            <Image source={logo} style={styles.modalLogo} />
            <Image 
                source={require('../assets/LivraLivro.png')} 
                style={styles.modalLivraLivroText} 
            />

            <TouchableOpacity 
                style={styles.createAccountButton}
                onPress={handleCreateAccount}
            >
                <Text style={styles.createAccountButtonText}>
                Criar conta
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>
                Log in
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.notNowButton}
                onPress={handleNotNow}
            >
                <Text style={styles.notNowButtonText}>
                Agora não, obrigado!
                </Text>
            </TouchableOpacity>
            </View>
        </TouchableOpacity>
        </TouchableOpacity>
    </Modal>

    </View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
safeArea: {
flex: 1,
backgroundColor: greyBackground,
},
appContainer: {
flex: 1,
backgroundColor: '#fff',
},
loadingContainer: {
flex: 1,
justifyContent: "center",
alignItems: "center",
backgroundColor: greyBackground,
},
header: {
alignItems: 'center',
paddingTop: 35,
paddingBottom: 20,
backgroundColor: '#fff',
},
logo: {
width: 71.806,
height: 47.487,
resizeMode: 'contain',
},
titleSection: {
alignItems: 'center',
paddingVertical: 20,
backgroundColor: '#fff',
},
mainTitle: {
fontSize: 24,
fontWeight: '700',
color: primaryPurple,
marginBottom: 5,
},
subtitle: {
fontSize: 14,
color: '#666',
},
contentScrollable: {
flex: 1,
},
bookSection: {
paddingTop: 15,
paddingLeft: 20,
marginBottom: 20,
},
sectionTitle: {
fontSize: 18,
fontWeight: '700',
color: textColorDark,
marginBottom: 15,
},
bookCardsRow: {
paddingRight: 20,
},
bookCard: {
width: 140,
backgroundColor: '#fff',
borderRadius: 10,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 8,
elevation: 5,
marginRight: 15,
overflow: 'hidden',
},
bookCover: {
width: '100%',
height: 180,
resizeMode: 'cover',
borderRadius: 10,
},
priceContainer: {
backgroundColor: 'rgba(255, 255, 255, 0.9)',
position: 'absolute',
bottom: 10,
right: 10,
paddingVertical: 5,
paddingHorizontal: 10,
borderRadius: 5,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 2,
},
priceText: {
color: textColorDark,
fontWeight: '600',
fontSize: 14,
},
// ESTILOS DO MODAL
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0, 0, 0, 0.5)',
justifyContent: 'flex-end',
},
modalContainer: {
backgroundColor: '#fff',
borderTopLeftRadius: 20,
borderTopRightRadius: 20,
paddingTop: 32,
paddingBottom: 40,
paddingHorizontal: 50,
alignItems: 'center',
shadowColor: '#000',
shadowOffset: { width: 0, height: -4 },
shadowOpacity: 0.25,
shadowRadius: 6,
elevation: 10,
},
modalLogo: {
width: 196,
height: 130,
resizeMode: 'contain',
marginBottom: 10,
},
modalLivraLivroText: {
width: 150,
height: 22,
resizeMode: 'contain',
marginBottom: 30,
},
createAccountButton: {
backgroundColor: primaryPurple,
borderRadius: 50,
width: 251,
height: 46,
justifyContent: 'center',
alignItems: 'center',
marginBottom: 15,
},
createAccountButtonText: {
color: '#fff',
fontSize: 20,
fontWeight: '400',
},
loginButton: {
backgroundColor: '#fff',
borderWidth: 2,
borderColor: primaryPurple,
borderRadius: 50,
width: 251,
height: 46,
justifyContent: 'center',
alignItems: 'center',
marginBottom: 15,
},
loginButtonText: {
color: primaryPurple,
fontSize: 20,
fontWeight: '400',
},
notNowButton: {
paddingVertical: 10,
},
notNowButtonText: {
color: primaryPurple,
fontSize: 14,
fontWeight: '700',
},
});