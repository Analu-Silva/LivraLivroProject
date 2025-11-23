import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { Ionicons } from "@expo/vector-icons";

export default function BottomNav() {
  const navigation = useNavigation(); 

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.touchArea} onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/house.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.touchArea} onPress={() => navigation.navigate("Favoritos")}>
          <Ionicons name="heart" size={29} color="#B431F4" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.touchArea} onPress={() => navigation.navigate("Menu")}>
          <View style={styles.menu}>
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  nav: {
    width: 161,
    height: 47,
    backgroundColor: "#fff",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 8,
  },
  // ÁREA DE TOQUE MAIOR - ADICIONE ISSO
  touchArea: {
    padding: 10, // Aumenta área de toque
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 23, height: 27, resizeMode: "contain" },
  iconFav: { width: 29, height: 29, resizeMode: "contain" },
  menu: {
    width: 22,
    height: 18,
    justifyContent: "space-between",
  },
  line: {
    width: "100%",
    height: 3,
    backgroundColor: "#B431F4",
    borderRadius: 3,
  },
});
