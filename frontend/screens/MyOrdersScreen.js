import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";

const OrdersScreen = ({ navigation }) => {
  const orderItems = [
    {
      id: 1,
      title: "Um de nós está mentindo",
      price: 30.0,
      image:
        "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: 2,
      title: "Black Notice",
      price: 45.0,
      image:
        "https://m.media-amazon.com/images/I/71z+2iDQjJL._AC_UF894,1000_QL80_.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.navigate("Menu")} />
          <Text style={styles.headerTitle}>Seus Pedidos</Text>
        </View>

        {/* Lista de pedidos */}
        <View style={styles.listContainer}>
          {orderItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.bookImage} />
              <View style={styles.infoContainer}>
                <Text style={styles.priceText}>
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </Text>
                <Text style={styles.titleText}>{item.title}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;

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
  listContainer: {
    paddingHorizontal: 25,
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
  reviewButton: {
    borderColor: primaryPurple,
    borderWidth: 1.2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  reviewButtonText: {
    color: primaryPurple,
    fontSize: 13,
    fontWeight: "500",
  },
});
