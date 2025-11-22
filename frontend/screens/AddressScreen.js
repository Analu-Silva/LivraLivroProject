import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import BackButton from "../components/BackButton";

const primaryPurple = "#B431F4";

const AddressScreen = ({ navigation }) => {
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Endereço de entrega</Text>
        </View>

        {/* CEP */}
        <View style={styles.section}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
          />
        </View>

        {/* Rua */}
        <View style={styles.section}>
          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        {/* Bairro */}
        <View style={styles.section}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={neighborhood}
            onChangeText={setNeighborhood}
          />
        </View>

        {/* Número e Complemento */}
        <View style={[styles.row, styles.section]}>
          <View style={styles.half}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={styles.input}
              value={complement}
              onChangeText={setComplement}
            />
          </View>
        </View>

        {/* Cidade e Estado */}
        <View style={[styles.row, styles.section]}>
          <View style={styles.half}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Estado</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Salvar Endereço</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddressScreen;

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
    paddingHorizontal: 20, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: primaryPurple,
    marginLeft: 10,
  },

  section: {
    marginHorizontal: 20, 
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
    paddingLeft: 10, 
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  half: {
    flex: 1,
  },
  saveButton: {
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
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
