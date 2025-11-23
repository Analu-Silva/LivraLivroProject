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
import BackButton from "../components/BackButton";
import { getUserBooks, deleteBook } from "../services/bookService";

const primaryPurple = "#B431F4";

const SalesScreen = ({ navigation }) => {
  const [salesItems, setSalesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserBooks();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const books = await getUserBooks();
      
      console.log('Livros recebidos:', books);

      const formattedBooks = Array.isArray(books) ? books.map(book => ({
        id: book.id,
        title: book.title || 'Sem título',
        price: book.price ? Number(book.price) : 0,
        image: book.imagesUrls && Array.isArray(book.imagesUrls) && book.imagesUrls.length > 0 
          ? book.imagesUrls[0].imageUrl 
          : null,
        author: book.author || 'Autor desconhecido',
        pages: book.numberOfPages,
        condition: book.bookCondition && book.bookCondition.id === 2 ? 'Novo' : 'Usado',
      })) : [];

      setSalesItems(formattedBooks);
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
      setError(err.message || 'Erro ao carregar suas vendas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (bookId, title) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja remover "${title}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remover',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              setSalesItems(prev => prev.filter(item => item.id !== bookId));
              Alert.alert('Sucesso', 'Livro removido com sucesso');
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível remover o livro');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Suas vendas</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryPurple} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Suas vendas</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadUserBooks}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : salesItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não tem vendas</Text>
            <Text style={styles.emptySubtext}>Comece adicionando um livro</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Adicionar')}
            >
              <Text style={styles.addButtonText}>+ Adicionar venda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          salesItems.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.bookImage} />
              ) : (
                <View style={[styles.bookImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderText}>Sem imagem</Text>
                </View>
              )}
              <View style={styles.infoContainer}>
                <Text style={styles.priceText}>R$ {item.price.toFixed(2)}</Text>
                <Text style={styles.titleText} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.detailText}>{item.author}</Text>
                <Text style={styles.conditionText}>{item.condition}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('Adicionar', { bookId: item.id })}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id, item.title)}
                  >
                    <Text style={styles.deleteButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {salesItems.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Adicionar")}
          >
            <Text style={styles.addButtonText}>Adicionar outra venda</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
};

export default SalesScreen;

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
    paddingHorizontal: 25, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 25, 
    paddingBottom: 50,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  bookImage: {
    width: 155,
    height: 149,
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
    marginLeft: 12,
    justifyContent: "center",
  },
  priceText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  titleText: {
    fontSize: 15,
    color: "#333",
    marginTop: 3,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  conditionText: {
    fontSize: 11,
    color: primaryPurple,
    marginTop: 2,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  editButton: {
    borderColor: primaryPurple,
    borderWidth: 1.2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: 'center',
  },
  editButtonText: {
    color: primaryPurple,
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    borderColor: '#b00020',
  },
  deleteButtonText: {
    color: '#b00020',
    fontSize: 12,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: primaryPurple,
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    alignSelf: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffecec',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#b00020',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#b00020',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});