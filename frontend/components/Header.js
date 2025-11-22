
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import flagBr from "../assets/bandeira brasil.png";
import flagUsa from "../assets/bandeira eua.png";
import sacola from "../assets/sacola de compras.png";
import profilePhoto from "../assets/perfil sem foto.png";

export default function Header({ currency, setCurrency, navigation, setShowLoginModal, onToggleCurrency }) {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <View style={styles.right}>
        <TouchableOpacity onPress={() => (onToggleCurrency ? onToggleCurrency() : setCurrency(currency === "BRL" ? "USD" : "BRL"))}>
          <Image source={currency === "BRL" ? flagBr : flagUsa} style={styles.flag} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Sacola")}>
          <Image source={sacola} style={styles.bag} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLoginModal(true)}>
          <Image source={profilePhoto} style={styles.profile} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 35,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  logo: {
    width: 72,
    height: 47,
    resizeMode: "contain",
  },
  flag: { width: 32, height: 33, resizeMode: "contain" },
  bag: { width: 21, height: 22, resizeMode: "contain" },
  profile: { width: 42, height: 42, borderRadius: 16 }
});
