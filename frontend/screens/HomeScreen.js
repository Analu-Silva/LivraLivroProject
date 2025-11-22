import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
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
      { id: "book-31", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-32", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-33", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-34", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-35", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-36", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-7',
    title: 'Comédia e Sátira',
    data: [
      { id: "book-37", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-38", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-39", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-40", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-41", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-42", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-8',
    title: 'Biografias e Memórias',
    data: [
      { id: "book-43", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-44", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-45", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-46", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-47", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-48", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
  {
    id: 'section-9',
    title: 'Autoajuda e Desenvolvimento Pessoal',
    data: [
      { id: "book-49", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-50", image: require("../assets/livro.jpg"), price: 27.0 },
      { id: "book-51", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-52", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-53", image: require("../assets/livro.jpg"), price: 29.0 },
      { id: "book-54", image: require("../assets/livro.jpg"), price: 29.0 },
    ],
  },
];

export default function HomeScreen({ requireLoginOnBookClick = false }) {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const [currency, setCurrency] = useState("BRL");

  const [bookSections, setBookSections] = useState(bookSectionsData);
  const [originalBookSections] = useState(bookSectionsData);

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

  const handleToggleCurrency = async () => {
    const newCurrency = currency === "BRL" ? "USD" : "BRL";
    // If switching to USD, call currency service to convert all prices.
    if (newCurrency === "USD") {
      try {
        setLoading(true);
        const { convertValue } = await import("../services/currencyService");

        const convertedSections = await Promise.all(
          bookSections.map(async (section) => {
            const convertedData = await Promise.all(
              section.data.map(async (item) => {
                try {
                  const converted = await convertValue(item.price, "BRL", "USD");
                  return { ...item, price: Number(converted) };
                } catch (err) {
                  return { ...item };
                }
              })
            );
            return { ...section, data: convertedData };
          })
        );

        setBookSections(convertedSections);
        setCurrency(newCurrency);
      } catch (err) {
        Alert.alert("Erro", "Falha ao converter moeda: " + (err.message || err));
      } finally {
        setLoading(false);
      }
    } else {
      // switching back to BRL: restore original prices
      setBookSections(originalBookSections);
      setCurrency(newCurrency);
    }
  };

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
      <TouchableOpacity 
        style={styles.screenContainer}
        activeOpacity={1}
        onPress={() => {
          if (requireLoginOnBookClick) {
            setShowLoginModal(true);
          }
        }}
        disabled={!requireLoginOnBookClick}
      >

        {/* HEADER */}
        <View pointerEvents={requireLoginOnBookClick ? "none" : "auto"}>
          <Header
            currency={currency}
            setCurrency={setCurrency}
            onToggleCurrency={handleToggleCurrency}
            navigation={navigation}
            setShowLoginModal={setShowLoginModal}
          />
        </View>

        {/* SEARCH BAR */}
        <View pointerEvents={requireLoginOnBookClick ? "none" : "auto"}>
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            onSubmit={handleSearchSubmit}
          />
        </View>

        {/* FILTER + SORT */}
        <View pointerEvents={requireLoginOnBookClick ? "none" : "auto"}>
          <FilterSort
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            filterMenu={filterMenu}
            sortMenu={sortMenu}
          />
        </View>

        <View style={styles.shadowDivider} />

        {/* LISTA DE SEÇÕES */}
        <ScrollView 
          style={{ flex: 1 }}
          pointerEvents={requireLoginOnBookClick ? "none" : "auto"}
        >
          {bookSections.map((section) => (
            <BookSections
              key={section.id}
              section={section}
              navigation={navigation}
              currency={currency}
            />
          ))}
        </ScrollView>

        {/* BOTTOM NAV */}
        <View pointerEvents={requireLoginOnBookClick ? "none" : "auto"}>
          <BottomNav />
        </View>

        {/* MODAL LOGIN */}
        <LoginModal
          visible={showLoginModal}
          setVisible={setShowLoginModal}
          navigation={navigation}
        />

      </TouchableOpacity>
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