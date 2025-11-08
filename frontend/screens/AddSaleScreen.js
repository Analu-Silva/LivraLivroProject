import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";

const AddSaleScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Usado");
  const [showOptions, setShowOptions] = useState(false);
  const [years, setYears] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genres, setGenres] = useState([]);
  const [showGenreMenu, setShowGenreMenu] = useState(false);

  const genreOptions = [
    "Ação",
    "Romance",
    "Drama",
    "Fantasia",
    "Terror",
    "Suspense",
    "Ficção Científica",
    "Comédia",
  ];

  const addGenre = (genre) => {
    if (!genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
  };

  const removeGenre = (genre) => {
    setGenres(genres.filter((g) => g !== genre));
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Venda</Text>
      </View>

      {/* Fotos */}
      <Text style={styles.labelPhoto}>Fotos</Text>
      <TouchableOpacity style={styles.photoBox}>
        <Ionicons name="add" size={45} color={primaryPurple} />
      </TouchableOpacity>
      <Text style={styles.photoNote}>Frente e verso são obrigatórios</Text>

      {/* Título */}
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      {/* Gêneros literários */}
      <Text style={styles.label}>Gêneros literários</Text>

      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <View key={genre} style={styles.genreButton}>
            <Text style={styles.genreText}>{genre}</Text>
            <TouchableOpacity onPress={() => removeGenre(genre)}>
              <Ionicons name="close" size={15} color={primaryPurple} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ position: "relative", marginBottom: 12 }}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowGenreMenu(!showGenreMenu)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownText}>
            {showGenreMenu ? "Fechar menu" : "Selecionar gênero"}
          </Text>
          <Ionicons
            name={showGenreMenu ? "chevron-up" : "chevron-down"}
            size={16}
            color={primaryPurple}
          />
        </TouchableOpacity>

        {showGenreMenu && (
          <View style={styles.dropdownMenu}>
            {genreOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => {
                  addGenre(option);
                  setShowGenreMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    genres.includes(option) && {
                      color: primaryPurple,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Páginas e status */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Nº de páginas</Text>
          <TextInput
            style={styles.input}
            value={pages}
            onChangeText={setPages}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Status</Text>
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowOptions(!showOptions)}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownText}>{status}</Text>
              <Ionicons name="chevron-down" size={16} color={primaryPurple} />
            </TouchableOpacity>

            {showOptions && (
              <View style={styles.dropdownMenu}>
                {["Usado", "Novo"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setStatus(option);
                      setShowOptions(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        option === status && {
                          fontWeight: "600",
                          color: primaryPurple,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Valor e anos */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            placeholder="R$"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Quantos anos?</Text>
          <TextInput
            style={styles.input}
            value={years}
            onChangeText={setYears}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Editora e ISBN */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Editora</Text>
          <TextInput
            style={styles.input}
            value={publisher}
            onChangeText={setPublisher}
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>ISBN</Text>
          <TextInput
            style={styles.input}
            value={isbn}
            onChangeText={setIsbn}
          />
        </View>
      </View>

      {/* Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Nos fale mais sobre..."
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
      />

      {/* Botão principal */}
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Registrar venda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddSaleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20, 
    paddingTop: 20, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },
  labelPhoto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3d3d3dff",
    marginBottom: 5,
    alignSelf: "center",
  },
  photoBox: {
    borderWidth: 2,
    borderColor: primaryPurple,
    borderStyle: "dashed",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 145,
    height: 139,
    marginVertical: 10,
    alignSelf: "center",
  },
  photoNote: {
    marginTop: 6,
    marginBottom: 18,
    color: "#312e2eff",
    fontSize: 12,
    alignSelf: "center",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  genreButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  genreText: {
    color: primaryPurple,
    fontWeight: "600",
    marginRight: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: primaryPurple,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    color: "#000",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  registerButton: {
    backgroundColor: primaryPurple,
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  registerText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
