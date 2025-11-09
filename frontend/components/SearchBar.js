import React from "react";
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const searchIcon = require("../assets/icon pesquisa.png");
const primaryPurple = "#B431F4";

export default function SearchBar({ searchText, setSearchText, onSubmit }) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity style={styles.iconBtn} onPress={() => onSubmit?.(searchText)}>
          <Image source={searchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 25,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: 316,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: primaryPurple,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 13,
    paddingHorizontal: 10,
    color: "#000",
  },
  iconBtn: {
    padding: 5,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
});
