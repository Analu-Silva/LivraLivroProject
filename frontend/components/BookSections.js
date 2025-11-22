import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function BookSections({ section, navigation, currency = 'BRL' }) {
  const formatPrice = (price) => {
    if (currency === 'USD') {

      return `US$ ${price.toFixed(2)}`;
    }
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detalhes do Livro", { id: item.id })}
    >
      <Image source={item.image} style={styles.img} />
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{section.title}</Text>

      <FlatList
        data={section.data}
        renderItem={renderBook}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 15,
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 15,
    elevation: 5,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },
  priceBox: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
});
