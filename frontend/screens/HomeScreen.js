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
  TextInput,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const genericBookImage = require('../assets/livro.jpg');
const flagBr = require('../assets/bandeira brasil.png');
const flagUsa = require('../assets/bandeira eua.png');
const profilePhoto = require('../assets/perfil sem foto.png');
const sacola = require('../assets/sacola de compras.png');
const searchIcon = require('../assets/icon pesquisa.png');
const logo = require('../assets/logo.png');

const primaryPurple = '#B431F4';
const secundaryColor = '#A8F000';
const textColorDark = '#333';
const greyBackground = '#f0f2f5';

// Dados de exemplo
const bookSectionsData = [
  {
    id: 'section-1',
    title: 'Recomendados',
    data: [
      { id: 'book-1', image: genericBookImage, price: 35.00 },
      { id: 'book-2', image: genericBookImage, price: 35.00 },
      { id: 'book-3', image: genericBookImage, price: 30.00 },
    ],
  },
  {
    id: 'section-2',
    title: 'Romance e Drama',
    data: [
      { id: 'book-7', image: genericBookImage, price: 27.00 },
      { id: 'book-8', image: genericBookImage, price: 27.00 },
      { id: 'book-9', image: genericBookImage, price: 25.00 },
    ],
  },
];

// ============================================
// COMPONENTE PRINCIPAL (ACEITA PROP!)
// ============================================
export default function HomeScreen({ showModalOnClick = false }) {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const navigation = useNavigation();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [openFilterSubmenu, setOpenFilterSubmenu] = useState(null);
  const [openSortSubmenu, setOpenSortSubmenu] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const filterMenu = [
    { title: 'Gênero', sub: ['Romance', 'Terror', 'Suspense'] },
    { title: 'Autor', sub: null },
    { title: 'Condição', sub: null },
    { title: 'Promoções', sub: null },
  ];

  const sortMenu = [
    { title: 'Preço', sub: ['Maior', 'Menor'] },
    { title: 'Lançamento', sub: null },
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [showModalOnClick]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleSearchSubmit = () => {
    if (showModalOnClick) {
      // Se for PreHome, abre o modal
      setShowLoginModal(true);
    } else {
      // Se for Home normal, faz a busca
      alert(`Você buscou por: ${searchText}`);
    }
  };

  const handleBookPress = (item) => {
    if (showModalOnClick) {
      // PreHome: Abre modal de login
      setShowLoginModal(true);
    } else {
      // Home normal: Navega para detalhes
      navigation.navigate("ProductDetail", { id: item.id });
    }
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
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => handleBookPress(item)}
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

        {/* Header */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setCurrency(currency === "BRL" ? "USD" : "BRL")}>
              <Image 
                source={currency === "BRL" ? flagBr : flagUsa} 
                style={styles.flagIcon} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (showModalOnClick) {
                setShowLoginModal(true);
              } else {
                navigation.navigate('Sacola');
              }
            }}>
              <Image source={sacola} style={styles.bagIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (showModalOnClick) {
                setShowLoginModal(true);
              }
            }}>
              <Image source={profilePhoto} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de pesquisa */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarInner}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity 
              style={styles.searchIconButton}
              onPress={handleSearchSubmit}
            >
              <Image source={searchIcon} style={styles.searchIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter and Sort Buttons */}
        <View style={styles.filterSortContainer}>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter ? styles.filterButtonActive : null,
              ]}
              onPress={() => {
                if (showModalOnClick) {
                  setShowLoginModal(true);
                } else {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowSortDropdown(false);
                  setOpenFilterSubmenu(null);
                }
              }}
            >
              <Text
                style={[
                  styles.filterSortButtonText,
                  selectedFilter ? styles.filterSortButtonTextActive : null,
                ]}
              >
                Filtrar por
              </Text>
              <Feather
                name={showFilterDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color={selectedFilter ? primaryPurple : "white"}
              />
            </TouchableOpacity>

            {!showModalOnClick && showFilterDropdown && (
              <View style={styles.dropdownMenu}>
                {filterMenu.map((m) => (
                  <View key={m.title}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        if (m.sub && m.sub.length) {
                          setOpenFilterSubmenu(
                            openFilterSubmenu === m.title ? null : m.title
                          );
                        } else {
                          setSelectedFilter(m.title);
                          setShowFilterDropdown(false);
                          setOpenFilterSubmenu(null);
                        }
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {m.title}
                      </Text>
                      <Feather
                        name={
                          m.sub && m.sub.length
                            ? openFilterSubmenu === m.title
                              ? "chevron-down"
                              : "chevron-right"
                            : "chevron-right"
                        }
                        size={18}
                        color={primaryPurple}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                selectedSort ? styles.sortButtonActive : null,
              ]}
              onPress={() => {
                if (showModalOnClick) {
                  setShowLoginModal(true);
                } else {
                  setShowSortDropdown(!showSortDropdown);
                  setShowFilterDropdown(false);
                  setOpenSortSubmenu(null);
                }
              }}
            >
              <Text
                style={[
                  styles.filterSortButtonText,
                  selectedSort ? styles.filterSortButtonTextActive : null,
                ]}
              >
                Ordenar por
              </Text>
              <Feather
                name={showSortDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color={selectedSort ? primaryPurple : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shadowDivider} />

        {/* Content Scrollable */}
        <ScrollView style={styles.contentScrollable}>
          {bookSectionsData.map((section) => (
            <View key={section.id} style={styles.bookSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <FlatList
                data={section.data}
                renderItem={renderBookCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bookCardsRow}
              />
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavWrapper}>
          <View style={styles.bottomNav}>
            <TouchableOpacity>
              <Image
                source={require('../assets/house.png')}
                style={styles.house}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../assets/favorito.png')}
                style={styles.iconFavorito}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
              <View style={styles.menu}>
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
                <View style={styles.menuLine} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* MODAL DE LOGIN (só aparece se showModalOnClick = true) */}
        {showModalOnClick && (
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
        )}

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
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: greyBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    backgroundColor: '#fff',
  },
  logo: {
    width: 71.806,
    height: 47.487,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  flagIcon: {
    width: 32,
    height: 33,
    resizeMode: 'contain',
  },
  bagIcon: {
    width: 20.95,
    height: 22,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    resizeMode: 'contain',
  },
  searchBarContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 316,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: primaryPurple,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 13,
    color: '#000',
    paddingHorizontal: 10,
  },
  searchIconButton: {
    padding: 5,
  },
  searchIconImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownWrapper: {
    position: 'relative',
    marginHorizontal: 8,
  },
  filterButton: {
    backgroundColor: primaryPurple,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    minWidth: 140,
  },
  sortButton: {
    backgroundColor: primaryPurple,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    minWidth: 140,
  },
  filterSortButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: secundaryColor,
  },
  sortButtonActive: {
    backgroundColor: secundaryColor,
  },
  filterSortButtonTextActive: {
    color: primaryPurple,
    fontWeight: '700',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 44,
    left: 0,
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 9999,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemText: {
    fontSize: 15,
    color: primaryPurple,
    fontWeight: '600',
  },
  shadowDivider: {
    height: 0.20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 1,
  },
  contentScrollable: {
    flex: 1,
    paddingBottom: 80,
  },
  bookSection: {
    paddingTop: 15,
    paddingLeft: 20,
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
    marginBottom: 15,
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
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    width: 161,
    height: 47,
    paddingVertical: 2,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  house: {
    width: 23,
    height: 27,
    resizeMode: 'contain',
  },
  iconFavorito: {
    width: 29,
    height: 29,
    resizeMode: 'contain',
  },
  menu: {
    width: 22,
    height: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLine: {
    width: '100%',
    height: 3,
    borderRadius: 3,
    backgroundColor: primaryPurple,
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