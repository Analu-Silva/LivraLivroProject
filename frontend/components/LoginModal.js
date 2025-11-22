import React from "react";
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";

const primaryPurple = "#B431F4";

export default function LoginModal({ visible, setVisible, navigation }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setVisible(false)}
        activeOpacity={1}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.box}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <Image source={require("../assets/LivraLivro.png")} style={styles.textLogo} />

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                setVisible(false);
                navigation.navigate("Register");
              }}
            >
              <Text style={styles.primaryText}>Criar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => {
                setVisible(false);
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.outlineText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.skip}>Agora não, obrigado!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  box: {
    backgroundColor: "#fff",
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 110,
    resizeMode: "contain",
  },
  textLogo: {
    width: 150,
    height: 22,
    marginBottom: 30,
    resizeMode: "contain",
  },
  primaryBtn: {
    backgroundColor: primaryPurple,
    width: 251,
    height: 46,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  primaryText: {
    color: "#fff",
    fontSize: 20,
  },
  outlineBtn: {
    width: 251,
    height: 46,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: primaryPurple,
    marginBottom: 15,
  },
  outlineText: {
    color: primaryPurple,
    fontSize: 20,
  },
  skip: {
    color: primaryPurple,
    fontSize: 14,
    fontWeight: "700",
  },
});
