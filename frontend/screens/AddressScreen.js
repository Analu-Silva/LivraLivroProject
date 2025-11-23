import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import BackButton from "../components/BackButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAddress, createAddress, updateAddress } from "../services/addressService";
import { Alert, ActivityIndicator } from "react-native";

const primaryPurple = "#B431F4";

const AddressScreen = ({ navigation }) => {
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [loading, setLoading] = useState(false);
  const [addressExists, setAddressExists] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const addr = await getAddress(userId);
        if (!mounted) return;
        if (addr) {
          setAddressExists(true);
          setCep(addr.zipCode || addr.cep || '');
          setStreet(addr.street || '');
          setNumber(addr.number ? String(addr.number) : '');
          setComplement(addr.complement || '');
          setCity(addr.city || '');
          setState(addr.state || '');
          setNeighborhood(addr.neighborhood || '');
        }
      } catch (e) {
        console.warn('Erro ao carregar endereço:', e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Erro', 'Você precisa estar logado para salvar o endereço');
        return;
      }

      const payload = {
        zipCode: cep,
        cep,
        street,
        number: number || null,
        complement,
        city,
        state,
        neighborhood,
        country: 'Brasil',
      };

      let result;
      if (addressExists) {
        result = await updateAddress(userId, payload);
      } else {
        result = await createAddress(userId, payload);
      }

      Alert.alert('Sucesso', 'Endereço salvo com sucesso');
      // sinaliza para a tela anterior que o endereço foi atualizado
      navigation.goBack();
      return result;
    } catch (e) {
      console.error('Erro ao salvar endereço:', e);
      Alert.alert('Erro', 'Não foi possível salvar o endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveText}>Salvar Endereço</Text>
          )}
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