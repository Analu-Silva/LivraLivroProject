import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MySalesScreen = ({ navigation }) => {
  const sales = [
    {
      id: 1,
      title: "Um de nós está mentindo",
      price: 30,
      image: "https://example.com/umdenos.jpg",
    },
    {
      id: 2,
      title: "Black Notice",
      price: 45,
      image: "https://example.com/blacknotice.jpg",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#B431F4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUAS VENDAS</Text>
      </View>

      {/* Lista de vendas */}
      {sales.map((sale) => (
        <View key={sale.id} style={styles.saleItem}>
          <Image source={{ uri: sale.image }} style={styles.saleImage} />
          <View style={styles.saleInfo}>
            <Text style={styles.saleTitle}>{sale.title}</Text>
            <Text style={styles.salePrice}>R$ {sale.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>Alterar informações</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botão adicionar venda */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSale")}
      >
        <Text style={styles.addButtonText}>Adicionar venda</Text>
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
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#B431F4" 
  },
  saleItem: { 
    flexDirection: "row", 
    marginBottom: 15, 
    backgroundColor: "#F7F2FB", 
    borderRadius: 12, 
    padding: 10 
  },
  saleImage: { 
    width: 70, 
    height: 100, 
    borderRadius: 8, 
    marginRight: 10 
  },
  saleInfo: { 
    flex: 1, 
    justifyContent: "center" 
  },
  saleTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#333" 
  },
  salePrice: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#B431F4", 
    marginVertical: 5 
  },
  editButton: { 
    borderWidth: 1, 
    borderColor: "#B431F4", 
    borderRadius: 8, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    alignSelf: "flex-start" 
  },
  editText: { 
    fontSize: 12, 
    color: "#B431F4", 
    fontWeight: "600" 
  },
  addButton: { 
    backgroundColor: "#B431F4", 
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: "center", 
    marginTop: 20, 
    marginBottom: 30 
  },
  addButtonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "bold"
  },
});

export default MySalesScreen;
