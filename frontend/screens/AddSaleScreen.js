import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddSaleScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#B431F4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VENDA</Text>
      </View>

      {/* Fotos */}
      <TouchableOpacity style={styles.photoBox}>
        <Text style={styles.photoText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.photoNote}>Frente e verso são obrigatórios</Text>

      {/* Campos */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Gêneros literários</Text>
      <View style={styles.genreContainer}>
        {["Crime", "Thriller", "Ação"].map((genre) => (
          <TouchableOpacity key={genre} style={styles.genreButton}>
            <Text style={styles.genreText}>{genre}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addGenreButton}>
          <Text style={styles.genreText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Nº de páginas"
          value={pages}
          onChangeText={setPages}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.rowInput]}
          placeholder="Valor R$"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
      </View>

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Entrega */}
      <View style={styles.deliveryContainer}>
        <TouchableOpacity style={styles.checkbox}>
          <Ionicons name="checkmark" size={16} color="#B431F4" />
        </TouchableOpacity>
        <Text style={styles.deliveryText}>Selecionar Biblioteca</Text>
      </View>

      {/* Botão adicionar */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 20, 
    paddingTop: 15 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 15, 
    marginTop: 30,
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#B431F4" 
  },
  photoBox: { 
    width: 100, 
    height: 100, 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 5 
  },
  photoText: { 
    fontSize: 24, 
    color: "#B431F4", 
    fontWeight: "bold" 
  },
  photoNote: { 
    fontSize: 12, 
    color: "#777", 
    marginBottom: 15 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 12, 
    padding: 10, 
    marginBottom: 10 
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 5 
  },
  genreContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginBottom: 15, 
    gap: 8 
  },
  genreButton: { 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 12, 
    paddingVertical: 5, 
    paddingHorizontal: 10 
  },
  addGenreButton: { 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 12, 
    paddingVertical: 5, 
    paddingHorizontal: 10 
  },
  genreText: { 
    color: "#B431F4", 
    fontWeight: "600" 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 
  },
  rowInput: { 
    flex: 1, 
    marginRight: 10 
  },
  deliveryContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  checkbox: { 
    width: 20,
    height: 20, 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 4, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 10 
  },
  deliveryText: { 
    color: "#333" 
  },
  addButton: { 
    backgroundColor: "#B431F4", 
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: "center", 
    marginBottom: 40 
  },
  addButtonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

export default AddSaleScreen;
