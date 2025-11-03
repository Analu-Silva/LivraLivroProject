import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#B431F4" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar livros..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => console.log("Selecionou:", item.title)}
          >
            <Text style={styles.resultText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 20 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 30,
    marginBottom: 20, 
    gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B431F4",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  resultText: { 
    fontSize: 16, 
    color: "#333" 
  },
});
