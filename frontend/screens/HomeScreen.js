import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterSort from "../components/FilterSort";
import BookSections from "../components/BookSections";
import BottomNav from "../components/BottomNav";
import LoginModal from "../components/LoginModal";


const primaryPurple = "#B431F4";
const secundaryColor = "#a4dc22ff";
const greyBackground = "#f0f2f5";

const bookSectionsData = [
  {
    id: "section-1",
    title: "Recomendados",
    data: [
      { id: "book-1", image: require("../assets/livro.jpg"), price: 35.0 },
      { id: "book-2", image: require("../assets/livro.jpg"), price: 35.0 },
      { id: "book-3", image: require("../assets/livro.jpg"), price: 30.0 },
      { id: "book-4", image: require("../assets/livro.jpg"), price: 35.0 },
      { id: "book-5", image: require("../assets/livro.jpg"), price: 35.0 },
      { id: "book-6", image: require("../assets/livro.jpg"), price: 30.0 },
    ],
  },
  {
    id: "section-2",
    title: "Romance e Drama",
    data: [
      { id: "book-7", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-8", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-9", image: require("../assets/livro.jpg"), price: 25.0 },
      { id: "book-10", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-11", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-12", image: require("../assets/livro.jpg"), price: 25.0 },
    ],
  },
  {
    id: "section-3",
    title: "Mistério e Thriller",
    data: [
      { id: "book-13", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-14", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-15", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-16", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-17", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-18", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: "section-4",
    title: "Fantasia e Ficção Científica",
    data: [
      { id: "book-19", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-20", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-21", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-22", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-23", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-24", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: "section-5",
    title: "Ação e Aventura",
    data: [
      { id: "book-25", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-26", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-27", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-28", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-29", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-30", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-6',
    title: 'Terror e Sobrenatural',
    data: [
      { id: "book-25", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-26", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-27", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-28", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-29", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-30", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-7',
    title: 'Comédia e Sátira',
    data: [
      { id: "book-25", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-26", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-27", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-28", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-29", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-30", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-8',
    title: 'Biografias e Memórias',
    data: [
      { id: "book-25", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-26", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-27", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-28", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-29", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-30", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-9',
    title: 'Autoajuda e Desenvolvimento Pessoal',
    data: [
      { id: "book-25", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-26", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-27", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-28", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-29", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-30", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },

];

export default function HomeScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const [currency, setCurrency] = useState("BRL");

  const [showLoginModal, setShowLoginModal] = useState(false);

  const filterMenu = [
    { title: "Gênero", sub: ["Romance", "Terror", "Suspense"] },
    { title: "Autor" },
    { title: "Condição" },
    { title: "Promoções" },
  ];

  const sortMenu = [
    { title: "Preço", sub: ["Maior", "Menor"] },
    { title: "Lançamento" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchSubmit = () => {
    Alert.alert("Busca", `Você buscou por: ${searchText}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryPurple} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>

        {/* HEADER */}
        <Header
          currency={currency}
          setCurrency={setCurrency}
          navigation={navigation}
          setShowLoginModal={setShowLoginModal}
        />

        {/* SEARCH BAR */}
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          onSubmit={handleSearchSubmit}
        />

        {/* FILTER + SORT */}
        <FilterSort
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          filterMenu={filterMenu}
          sortMenu={sortMenu}
        />

        <View style={styles.shadowDivider} />

        {/* LISTA DE SEÇÕES */}
        <ScrollView style={{ flex: 1 }}>
          {bookSectionsData.map((section) => (
            <BookSections
              key={section.id}
              section={section}
              navigation={navigation}
            />
          ))}
        </ScrollView>

        {/* BOTTOM NAV */}
        <BottomNav />

        {/* MODAL LOGIN */}
        <LoginModal
          visible={showLoginModal}
          setVisible={setShowLoginModal}
          navigation={navigation}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
    height: 0.3,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 5,
  },
});
