import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const livros = [
    { id: 1, title: "Harry Potter e a Câmara Secreta" },
    { id: 2, title: "Oratória para Advogados" },
    { id: 3, title: "Aprendendo React Native" },
    { id: 4, title: "JavaScript Avançado" },
  ];

  const filtered = livros.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Pesquisar</Text>
      </View>

      {/* Campo de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar livros..."
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
      />

      {/* Resultados */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => console.log("Selecionou:", item.title)}
          >
            <View style={styles.cardContent}>
              <Ionicons
                name="book-outline"
                size={22}
                color={primaryPurple}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.resultText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 15,
  },
});
