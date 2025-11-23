import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterSort from "../components/FilterSort";
import BookSections from "../components/BookSections";
import BottomNav from "../components/BottomNav";
import LoginModal from "../components/LoginModal";
import { getAllBooks, searchBooks, getBooksByGenre } from "../services/bookService";

const primaryPurple = "#B431F4";
const greyBackground = "#f0f2f5";

export default function HomeScreen({ requireLoginOnBookClick = false }) {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [currency, setCurrency] = useState("BRL");
  const [bookSections, setBookSections] = useState([]);
  const [originalBooks, setOriginalBooks] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const filterMenu = [
    { title: "Gênero", sub: ["Romance", "Terror", "Suspense", "Fantasia", "Ficção Científica"] },
    { title: "Autor" },
    { title: "Condição" },
  ];

  const sortMenu = [
    { title: "Preço", sub: ["Maior", "Menor"] },
    { title: "Lançamento" },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (originalBooks.length > 0) {
      applyFiltersAndSort();
    }
  }, [selectedFilter, selectedSort]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const books = await getAllBooks();
      
      console.log('Livros carregados:', books?.length || 0);
      
      setOriginalBooks(books || []);
      groupAndDisplayBooks(books || []);
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
      Alert.alert('Erro', 'Não foi possível carregar os livros');
      setBookSections([]);
    } finally {
      setLoading(false);
    }
  };

  const groupAndDisplayBooks = (books) => {
    const grouped = {};

    books.forEach(book => {
      // Agrupa por gênero - suporta variações de formato retornadas pela API
      const rawGenres = book.genre || book.genres || book.genresList || [];
      const genreNames = (Array.isArray(rawGenres) && rawGenres.length > 0)
        ? rawGenres.map(g => {
            if (!g && g !== 0) return 'Outros';
            if (typeof g === 'string') return g;
            if (typeof g === 'number') return `Gênero ${g}`;
            if (g.genre) return g.genre;
            if (g.name) return g.name;
            return 'Outros';
          })
        : ['Outros'];

      genreNames.forEach(genreName => {
        if (!grouped[genreName]) {
          grouped[genreName] = {
            id: `section-${genreName}`,
            title: genreName,
            data: [],
          };
        }

        grouped[genreName].data.push(formatBook(book));
      });
    });

    // Converte para array
    const sections = Object.values(grouped);
    setBookSections(sections);
  };

  const formatBook = (book) => {
    // Pega a primeira imagem - suporta variações no nome do campo retornado pela API
    let imageUrl = null;
    const possibleImageFields = [
      'imagesUrls', 'imagesUrl', 'images', 'images_urls', 'imageUrls', 'imageUrl'
    ];

    for (const field of possibleImageFields) {
      const val = book[field];
      if (Array.isArray(val) && val.length > 0) {
        // item pode ser string (url) ou objeto { imageUrl }
        const first = val[0];
        if (typeof first === 'string') {
          imageUrl = first;
          break;
        }
        if (first.imageUrl) {
          imageUrl = first.imageUrl;
          break;
        }
        if (first.url) {
          imageUrl = first.url;
          break;
        }
      }
    }

    return {
      id: book.id,
      image: imageUrl ? { uri: imageUrl } : require("../assets/livro.jpg"),
      price: book.price ? Number(book.price) : 0,
      title: book.title || 'Sem título',
      author: book.author || 'Autor desconhecido',
      condition: book.bookCondition && book.bookCondition.id === 2 ? 'Novo' : 'Usado',
      numberOfPages: book.numberOfPages,
    };
  };

  const applyFiltersAndSort = () => {
    let filtered = [...originalBooks];

    // Aplica filtro de gênero
    if (selectedFilter && selectedFilter.title === 'Gênero' && selectedFilter.sub) {
      filtered = filtered.filter(book => {
        const rawGenres = book.genre || book.genres || book.genresList || [];
        if (!Array.isArray(rawGenres) || rawGenres.length === 0) return false;

        return rawGenres.some(g => {
          if (!g && g !== 0) return false;
          if (typeof g === 'string') return g === selectedFilter.sub;
          if (typeof g === 'number') return String(g) === String(selectedFilter.sub);
          if (g.genre) return g.genre === selectedFilter.sub;
          if (g.name) return g.name === selectedFilter.sub;
          return false;
        });
      });
    }

    // Aplica filtro de condição
    if (selectedFilter && selectedFilter.title === 'Condição' && selectedFilter.sub) {
      const isNew = selectedFilter.sub === 'Novo';
      filtered = filtered.filter(book => 
        (isNew && book.bookCondition && book.bookCondition.id === 2) || 
        (!isNew && book.bookCondition && book.bookCondition.id === 1)
      );
    }

    // Aplica ordenação
    if (selectedSort && selectedSort.title === 'Preço' && selectedSort.sub) {
      filtered.sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        
        if (selectedSort.sub === 'Maior') {
          return priceB - priceA;
        } else {
          return priceA - priceB;
        }
      });
    }

    groupAndDisplayBooks(filtered);
  };

  const handleToggleCurrency = async () => {
    const newCurrency = currency === "BRL" ? "USD" : "BRL";
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
      loadBooks();
      setCurrency(newCurrency);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      const results = await searchBooks(searchText);
      
      console.log('Resultados da busca:', results?.length || 0);
      
      if (!results || results.length === 0) {
        Alert.alert("Busca", `Nenhum livro encontrado para: "${searchText}"`);
        setBookSections([]);
      } else {
        groupAndDisplayBooks(results);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível realizar a busca");
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchText("");
    setSelectedFilter(null);
    setSelectedSort(null);
    loadBooks();
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
            onClear={handleResetSearch}
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
          {bookSections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetSearch}
              >
                <Text style={styles.resetButtonText}>Limpar filtros</Text>
              </TouchableOpacity>
            </View>
          ) : (
            bookSections.map((section) => (
              <BookSections
                key={section.id}
                section={section}
                navigation={navigation}
                currency={currency}
              />
            ))
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: primaryPurple,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});