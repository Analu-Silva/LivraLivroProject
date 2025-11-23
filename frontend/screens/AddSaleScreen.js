import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary, createBook } from '../services/bookService';
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
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [formError, setFormError] = useState('');
  const [author, setAuthor] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  // Modais
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const genreOptions = [
    { id: 1, name: 'Ação' },
    { id: 2, name: 'Romance' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Fantasia' },
    { id: 5, name: 'Terror' },
    { id: 6, name: 'Suspense' },
    { id: 7, name: 'Ficção Científica' },
    { id: 8, name: 'Comédia' },
  ];

  const addGenre = (genreObj) => {
    if (!genres.find(g => g.id === genreObj.id)) {
      setGenres([...genres, genreObj]);
    }
  };

  const removeGenre = (genreObj) => {
    setGenres(genres.filter((g) => g.id !== genreObj.id));
  };

  const resolveLanguageId = (input) => {
    if (!input) return 1;
    const v = String(input).trim().toLowerCase();
    if (/^\d+$/.test(v)) return Number(v);
    if (v.includes('port')) return 1;
    if (v.includes('ing') || v.includes('english')) return 2;
    if (v.includes('esp') || v.includes('span')) return 3;
    return 1;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
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
        <TouchableOpacity style={styles.photoBox} onPress={async () => {
          try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== 'granted') {
              setErrorModalMessage('Permissão para acessar as imagens é necessária.');
              setErrorModalVisible(true);
              return;
            }

            const mediaTypesOption = ImagePicker?.MediaType?.Images ?? ImagePicker?.MediaType?.Images ?? ImagePicker?.MediaType?.All;
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: mediaTypesOption,
              allowsEditing: true,
              quality: 0.8,
            });

            if (result.canceled === true || result.cancelled === true) return;

            let selectedUri;
            if (result.assets && result.assets.length > 0) {
              selectedUri = result.assets[0].uri;
            } else if (result.uri) {
              selectedUri = result.uri;
            }

            if (!selectedUri) {
              setErrorModalMessage('Não foi possível obter a imagem selecionada.');
              setErrorModalVisible(true);
              return;
            }

            const newItem = { uri: selectedUri, uploading: true };
            setImages(prev => [newItem, ...prev]);

            try {
              const uploadedUrl = await uploadToCloudinary(selectedUri);
              setImages(prev => prev.map(it => it.uri === selectedUri ? { ...it, uploading: false, uploadedUrl } : it));
              setImageUploadError('');
            } catch (err) {
              console.warn('Erro ao enviar imagem', err);
              setImages(prev => prev.map(it => it.uri === selectedUri ? { ...it, uploading: false } : it));
              setImageUploadError('Falha ao enviar imagem. Tente novamente.');
            }

          } catch (err) {
            console.warn('Erro pick image', err);
          }
        }}>
          <Ionicons name="add" size={45} color={primaryPurple} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
          {images.map((it) => (
            <View key={it.uri} style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              {it.uploading ? (
                <ActivityIndicator />
              ) : (
                <Image source={{ uri: it.uploadedUrl || it.uri }} style={{ width: '100%', height: '100%' }} />
              )}
            </View>
          ))}
        </View>
        {imageUploadError ? <Text style={styles.errorText}>{imageUploadError}</Text> : null}
        <Text style={styles.photoNote}>Frente e verso são obrigatórios</Text>

        {/* Inputs */}
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Gêneros literários</Text>
        <View style={styles.genreContainer}>
          {genres.map((genre) => (
            <View key={genre.id} style={styles.genreButton}>
              <Text style={styles.genreText}>{genre.name}</Text>
              <TouchableOpacity onPress={() => removeGenre(genre)}>
                <Ionicons name="close" size={15} color={primaryPurple} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ position: "relative", marginBottom: 12, zIndex: 9999 }}>
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
            <View style={[styles.dropdownMenu, { zIndex: 9999 }]}>
              {genreOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    addGenre(option);
                    setShowGenreMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      genres.find(g => g.id === option.id) && {
                        color: primaryPurple,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {option.name}
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
            <View style={{ position: "relative", marginBottom: 12 }}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowOptions(!showOptions)}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownText}>{status}</Text>
                <Ionicons name="chevron-down" size={16} color={primaryPurple} />
              </TouchableOpacity>

              {showOptions && (
                <View style={[styles.dropdownMenu, { zIndex: 9999 }]}>
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

        {/* Autor e idioma */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Autor</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Idioma</Text>
            <TextInput
              style={styles.input}
              value={languageInput}
              onChangeText={setLanguageInput}
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
        <TouchableOpacity
          style={styles.registerButton}
          onPress={async () => {
            if (!title || !price) {
              setFormError('Preencha pelo menos título e preço');
              return;
            }

            if (!author) {
              setFormError('Preencha o nome do autor');
              return;
            }

            if (!pages || Number(pages) < 20) {
              setFormError('Número de páginas inválido (mínimo 20)');
              return;
            }

            setFormError('');
            setSubmitting(true);

            try {
              if (images.some(it => it.uploading)) {
                setFormError('Aguarde o upload das imagens antes de enviar.');
                setSubmitting(false);
                return;
              }

              const imageUrls = [];
              for (const it of images) {
                if (it.uploadedUrl) {
                  imageUrls.push(it.uploadedUrl);
                } else if (it.uri) {
                  try {
                    const uploaded = await uploadToCloudinary(it.uri);
                    imageUrls.push(uploaded);
                  } catch (e) {
                    console.warn('Falha upload final', e);
                  }
                }
              }

              if (images.length === 0) {
                setFormError('Insira pelo menos 1 foto do livro.');
                setSubmitting(false);
                return;
              }

              if (imageUrls.length === 0) {
                setFormError('As fotos não foram enviadas. Tente novamente.');
                setSubmitting(false);
                return;
              }

              const bookData = {
                imagesUrl: imageUrls,
                title: title,
                price: Number(price),
                currency: 'BRL',
                numberOfPages: pages ? Number(pages) : undefined,
                genresId: genres.map(g => g.id) || [],
                bookConditionId: status === 'Novo' ? 2 : 1,
                numberOfYears: years ? Number(years) : undefined,
                isbn: isbn || undefined,
                bookLanguageId: resolveLanguageId(languageInput),
                publisher: publisher || undefined,
                stock: 1,
                author: author || undefined,
                description: description || undefined,
              };

              await createBook(bookData);
              setFormError('');
              setSuccessModalVisible(true);

            } catch (err) {
              console.error('Erro criando livro', err);
              setErrorModalMessage(err.message || String(err));
              setErrorModalVisible(true);
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerText}>Registrar venda</Text>}
        </TouchableOpacity>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
      </ScrollView>

      {/* Modal de sucesso */}
      <Modal transparent animationType="fade" visible={successModalVisible} onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalMessage}>Livro cadastrado com sucesso!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setSuccessModalVisible(false); navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); }}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de erro */}
      <Modal transparent animationType="fade" visible={errorModalVisible} onRequestClose={() => setErrorModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Erro</Text>
            <Text style={styles.modalMessage}>{errorModalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setErrorModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: primaryPurple,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dropdownText: { fontSize: 16, color: "#333" },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: primaryPurple,
    zIndex: 999,
  },
  dropdownItem: { padding: 12 },
  dropdownItemText: { fontSize: 16 },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  registerButton: {
    backgroundColor: primaryPurple,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 20,
    alignItems: "center",
  },
  registerText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  errorText: { color: "red", fontSize: 14, textAlign: "center", marginTop: 5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "78%",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: primaryPurple, marginBottom: 8 },
  modalMessage: { fontSize: 15, color: "#333", marginBottom: 12, textAlign: "center" },
  modalButton: {
    backgroundColor: primaryPurple,
    paddingVertical: 10,
    borderRadius: 20,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  modalButtonText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
