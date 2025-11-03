import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { CurrentRenderContext, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const genericBookImage = require('../assets/livro.jpg');
const flagBr = require('../assets/bandeira brasil.png');
const flagUsa = require('../assets/bandeira eua.png');
const profilePhoto = require('../assets/perfil sem foto.png');
const sacola = require('../assets/sacola de compras.png');
const house = require('../assets/house.png');
const searchIcon = require('../assets/icon pesquisa.png');

// Cores e tamanhos definidos para replicar o design
const primaryPurple = '#B431F4';
const secundaryColor = '#A8F000';
const textColorDark = '#333';
const greyBackground = '#f0f2f5';

// Dados de exemplo para os livros (mantidos, mas só serão usados quando o FlatList for descomentado)
const bookSectionsData = [
  {
    id: 'section-1',
    title: 'Recomendados',
    data: [
      { id: 'book-1', image: genericBookImage, price: 35.00 },
      { id: 'book-2', image: genericBookImage, price: 35.00 },
      { id: 'book-3', image: genericBookImage, price: 30.00 },
      { id: 'book-4', image: genericBookImage, price: 35.00 },
      { id: 'book-5', image: genericBookImage, price: 35.00 },
      { id: 'book-6', image: genericBookImage, price: 30.00 },
    ],
  },
  {
    id: 'section-2',
    title: 'Romance e Drama',
    data: [
      { id: 'book-7', image: genericBookImage, price: 27.00 },
      { id: 'book-8', image: genericBookImage, price: 27.00 },
      { id: 'book-9', image: genericBookImage, price: 25.00 },
      { id: 'book-10', image: genericBookImage, price: 27.00 },
      { id: 'book-11', image: genericBookImage, price: 27.00 },
      { id: 'book-12', image: genericBookImage, price: 25.00 },
    ],
  },
  {
    id: 'section-3',
    title: 'Mistério e Thriller',
    data: [
      { id: 'book-13', image: genericBookImage, price: 27.00 },
      { id: 'book-14', image: genericBookImage, price: 27.00 },
      { id: 'book-15', image: genericBookImage, price: 29.00 },
      { id: 'book-16', image: genericBookImage, price: 29.00 },
      { id: 'book-17', image: genericBookImage, price: 29.00 },
      { id: 'book-18', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-4',
    title: 'Fantasia e Ficção Científica',
    data: [
      { id: 'book-19', image: genericBookImage, price: 27.00 },
      { id: 'book-20', image: genericBookImage, price: 27.00 },
      { id: 'book-21', image: genericBookImage, price: 29.00 },
      { id: 'book-22', image: genericBookImage, price: 29.00 },
      { id: 'book-23', image: genericBookImage, price: 29.00 },
      { id: 'book-24', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-5',
    title: 'Ação e Aventura',
    data: [
      { id: 'book-25', image: genericBookImage, price: 27.00 },
      { id: 'book-26', image: genericBookImage, price: 27.00 },
      { id: 'book-27', image: genericBookImage, price: 29.00 },
      { id: 'book-28', image: genericBookImage, price: 29.00 },
      { id: 'book-29', image: genericBookImage, price: 29.00 },
      { id: 'book-30', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-6',
    title: 'Terror e Sobrenatural',
    data: [
      { id: 'book-31', image: genericBookImage, price: 27.00 },
      { id: 'book-32', image: genericBookImage, price: 27.00 },
      { id: 'book-33', image: genericBookImage, price: 29.00 },
      { id: 'book-34', image: genericBookImage, price: 29.00 },
      { id: 'book-35', image: genericBookImage, price: 29.00 },
      { id: 'book-36', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-7',
    title: 'Comédia e Sátira',
    data: [
      { id: 'book-37', image: genericBookImage, price: 27.00 },
      { id: 'book-38', image: genericBookImage, price: 27.00 },
      { id: 'book-39', image: genericBookImage, price: 29.00 },
      { id: 'book-40', image: genericBookImage, price: 29.00 },
      { id: 'book-41', image: genericBookImage, price: 29.00 },
      { id: 'book-42', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-8',
    title: 'Biografias e Memórias',
    data: [
      { id: 'book-43', image: genericBookImage, price: 27.00 },
      { id: 'book-44', image: genericBookImage, price: 27.00 },
      { id: 'book-45', image: genericBookImage, price: 29.00 },
      { id: 'book-46', image: genericBookImage, price: 29.00 },
      { id: 'book-47', image: genericBookImage, price: 29.00 },
      { id: 'book-48', image: genericBookImage, price: 29.00 },
    ],
  },
  {
    id: 'section-9',
    title: 'Autoajuda e Desenvolvimento Pessoal',
    data: [
      { id: 'book-49', image: genericBookImage, price: 27.00 },
      { id: 'book-50', image: genericBookImage, price: 27.00 },
      { id: 'book-51', image: genericBookImage, price: 29.00 },
      { id: 'book-52', image: genericBookImage, price: 29.00 },
      { id: 'book-53', image: genericBookImage, price: 29.00 },
      { id: 'book-54', image: genericBookImage, price: 29.00 },
    ],
  },
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
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
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const formatPrice = (price) => {
    return `R\$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleSearchSubmit = () => {
    Alert.alert("Busca", `Você buscou por: ${searchText}`);
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate("Detalhe", { id: item.id })}
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

        {/* ========================================================================================================
           HEADER: Este bloco está CORRIGIDO e descomentado.
           ======================================================================================================== */}
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setCurrency(currency === "BRL" ? "USD" : "BRL")}>
              <Image
                source={currency === "BRL" ? flagBr : flagUsa}
                style={styles.flagIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Sacola')}>
              <Image source={sacola} style={styles.bagIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={profilePhoto} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================================================
           BARRA DE PESQUISA: Este bloco está CORRIGIDO e descomentado (com a correção da adjacência).
           ======================================================================================================== */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarInner}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            /><TouchableOpacity // <-- CORREÇÃO: Sem espaço entre TextInput e TouchableOpacity
              style={styles.searchIconButton}
              onPress={handleSearchSubmit}
            >
              <Image source={searchIcon} style={styles.searchIconImage} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================================================================
           FILTER AND SORT BUTTONS: Este bloco está CORRIGIDO e descomentado.
           ======================================================================================================== */}
        <View style={styles.filterSortContainer}>
          {/* FILTRAR POR */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter ? styles.filterButtonActive : null,
              ]}
              onPress={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowSortDropdown(false);
                setOpenFilterSubmenu(null);
              }}
            >
              <Text
                style={[
                  styles.filterSortButtonText,
                  selectedFilter ? styles.filterSortButtonTextActive : null,
                ]}
              >
                Filtrar por
              </Text><Feather // <-- CORREÇÃO: Sem espaço entre Text e Feather
                name={showFilterDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color={selectedFilter ? primaryPurple : "white"}
              />
            </TouchableOpacity>

            {showFilterDropdown && (
              <View style={styles.dropdownMenu}>
                {filterMenu.map((m) => (
                  <View key={m.title}>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        openFilterSubmenu === m.title && styles.dropdownItemActive,
                      ]}
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
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedFilter === m.title && styles.dropdownItemTextSelected,
                        ]}
                      >
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

                    {openFilterSubmenu === m.title && m.sub && (
                      <View style={styles.submenuContainer}>
                        {m.sub.map((sub) => (
                          <TouchableOpacity
                            key={sub}
                            style={[
                              styles.dropdownSubItem,
                              selectedFilter === sub && styles.dropdownItemSelected,
                            ]}
                            onPress={() => {
                              setSelectedFilter(sub);
                              setShowFilterDropdown(false);
                              setOpenFilterSubmenu(null);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                selectedFilter === sub &&
                                  styles.dropdownItemTextSelected,
                              ]}
                            >
                              {sub}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ORDENAR POR */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                selectedSort ? styles.sortButtonActive : null,
              ]}
              onPress={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowFilterDropdown(false);
                setOpenSortSubmenu(null);
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

            {showSortDropdown && (
              <View style={styles.dropdownMenu}>
                {sortMenu.map((m) => (
                  <View key={m.title}>
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        openSortSubmenu === m.title && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        if (m.sub && m.sub.length) {
                          setOpenSortSubmenu(
                            openSortSubmenu === m.title ? null : m.title
                          );
                        } else {
                          setSelectedSort(m.title);
                          setShowSortDropdown(false);
                          setOpenSortSubmenu(null);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedSort === m.title && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {m.title}
                      </Text>

                      <Feather
                        name={
                          m.sub && m.sub.length
                            ? openSortSubmenu === m.title
                              ? "chevron-down"
                              : "chevron-right"
                            : "chevron-right"
                        }
                        size={18}
                        color={primaryPurple}
                      />
                    </TouchableOpacity>

                    {openSortSubmenu === m.title && m.sub && (
                      <View style={styles.submenuContainer}>
                        {m.sub.map((sub) => (
                          <TouchableOpacity
                            key={sub}
                            style={[
                              styles.dropdownSubItem,
                              selectedSort === sub && styles.dropdownItemSelected,
                            ]}
                            onPress={() => {
                              setSelectedSort(sub);
                              setShowSortDropdown(false);
                              setOpenSortSubmenu(null);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                selectedSort === sub &&
                                  styles.dropdownItemTextSelected,
                              ]}
                            >
                              {sub}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.shadowDivider}/>
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

            <TouchableOpacity>
              <View style={styles.menu}>
                <View style={styles.menuLine}/>
                <View style={styles.menuLine}/>
                <View style={styles.menuLine}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingTop: 28,
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
    gap: 22,
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
    zIndex: 10,
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
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownItemActive: {
    // leve destaque quando abrir submenu principal (opcional)
  },
  submenuContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 6,
  },
  dropdownSubItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  dropdownItemSelected: {
    backgroundColor: secundaryColor,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 15,
    color: primaryPurple,
    fontWeight: '600',
  },
  dropdownItemTextSelected: {
    color: '#ffffffff',
    fontWeight: '700',
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
  arrowIcon: {
    marginLeft: 5,
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
    zIndex: 10,
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
    width: 28,
    height: 28,
    resizeMode: 'contain',
    alignItems: 'center',
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
  navButton: {
    padding: 60,
  },
  activeNavButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
});