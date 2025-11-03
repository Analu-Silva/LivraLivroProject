import React, { useState } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
StyleSheet,
Image,
SafeAreaView,
ScrollView,
Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const primaryColor = '#B431F4';
const secondaryColor = '#A8F000';
const lightPurple = '#DAB8F7';
const textColorDark = '#333';

export default function SettingsScreen({ navigation }) {
const [profileImage, setProfileImage] = useState(null);
const [gender, setGender] = useState('feminino'); // valor padrão
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [newPassword, setNewPassword] = useState('');
const [description, setDescription] = useState('');

const handleImagePick = () => {
Alert.alert('Foto de Perfil', 'Funcionalidade de escolher foto será implementada');
// Aqui você implementaria expo-image-picker
};

const handleSave = () => {
// Validações básicas
if (!phone || !email) {
    Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
    return;
}

// Aqui você faria a requisição para atualizar no backend
Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
navigation.goBack();
};

const handlePhoneChange = (text) => {
// Formatação automática do telefone
let rawText = text.replace(/\D/g, '');
if (rawText.length > 11) rawText = rawText.substring(0, 11);

let formattedPhone = '';
if (rawText.length > 0) formattedPhone = `(${rawText.substring(0, 2)}`;
if (rawText.length >= 3) {
    if (rawText.length <= 10) {
    formattedPhone += `) ${rawText.substring(2, 6)}`;
    if (rawText.length >= 7) formattedPhone += `-${rawText.substring(6, 10)}`;
    } else {
    formattedPhone += `) ${rawText.substring(2, 7)}`;
    if (rawText.length >= 8) formattedPhone += `-${rawText.substring(7, 11)}`;
    }
}
setPhone(formattedPhone);
};

return (
<SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
    
    {/* Header */}
    <View style={styles.header}>
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        >
        <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDITAR PERFIL</Text>
    </View>

    {/* Foto de perfil */}
    <View style={styles.profileSection}>
        <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePick}
        >
        <Image
            source={profileImage ? { uri: profileImage } : require('../assets/perfil sem foto.png')}
            style={styles.profileImage}
        />
        
        {/* Botão de editar (verde) */}
        <View style={styles.editButton}>
            <Feather name="edit-2" size={18} color="white" />
        </View>
        </TouchableOpacity>

        <Text style={styles.greeting}>Olá, Priscila!</Text>
    </View>

    {/* Seção de Gênero */}
    <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Gênero</Text>
        
        <View style={styles.genderOptions}>
        <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender('masculino')}
        >
            <View style={[
            styles.radioCircle,
            gender === 'masculino' && styles.radioCircleSelected,
            ]} />
            <Text style={styles.genderText}>Masculino</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender('feminino')}
        >
            <View style={[
            styles.radioCircle,
            gender === 'feminino' && styles.radioCircleSelected,
            ]} />
            <Text style={styles.genderText}>Feminino</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender('outro')}
        >
            <View style={[
            styles.radioCircle,
            gender === 'outro' && styles.radioCircleSelected,
            ]} />
            <Text style={styles.genderText}>Outro</Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity
        style={styles.genderOptionSingle}
        onPress={() => setGender('nao-informar')}
        >
        <View style={[
            styles.radioCircle,
            gender === 'nao-informar' && styles.radioCircleSelected,
        ]} />
        <Text style={styles.genderText}>Não informar</Text>
        </TouchableOpacity>
    </View>

    {/* Celular */}
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Celular</Text>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="(XX) XXXXX-XXXX"
            placeholderTextColor={lightPurple}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={15}
        />
        <Feather name="check-circle" size={20} color={secondaryColor} />
        </View>
    </View>

    {/* Email */}
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            placeholder="Insira seu email"
            placeholderTextColor={lightPurple}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
        />
        <Feather name="check-circle" size={20} color={secondaryColor} />
        </View>
    </View>

    {/* Redefinir Senha */}
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Redefinir Senha</Text>
        <TextInput
        style={styles.inputPassword}
        placeholder="Senha nova"
        placeholderTextColor={lightPurple}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        />
    </View>

    {/* Descrição */}
    <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Descrição</Text>
        <TextInput
        style={styles.textArea}
        placeholder="Nos fale mais sobre você..."
        placeholderTextColor={lightPurple}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        />
    </View>

    {/* Botão de Salvar */}
    <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
    >
        <Feather name="check" size={24} color="white" />
    </TouchableOpacity>

    </ScrollView>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
safeArea: {
flex: 1,
backgroundColor: '#fff',
},
container: {
flexGrow: 1,
paddingHorizontal: 30,
paddingTop: 20,
paddingBottom: 40,
},
header: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 30,
position: 'relative',
},
backButton: {
position: 'absolute',
left: 0,
zIndex: 10,
},
headerTitle: {
flex: 1,
fontSize: 14,
fontWeight: '600',
color: secondaryColor,
textAlign: 'center',
letterSpacing: 1,
},
profileSection: {
alignItems: 'center',
marginBottom: 30,
},
imageContainer: {
width: 140,
height: 140,
borderRadius: 70,
position: 'relative',
marginBottom: 15,
},
profileImage: {
width: '100%',
height: '100%',
borderRadius: 70,
resizeMode: 'cover',
},
editButton: {
position: 'absolute',
bottom: 0,
right: 0,
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: secondaryColor,
justifyContent: 'center',
alignItems: 'center',
},
greeting: {
fontSize: 20,
fontWeight: '700',
color: primaryColor,
},
formSection: {
width: '100%',
marginBottom: 20,
},
sectionLabel: {
fontSize: 16,
fontWeight: '600',
color: textColorDark,
marginBottom: 10,
},
genderOptions: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: 10,
},
genderOption: {
flexDirection: 'row',
alignItems: 'center',
},
genderOptionSingle: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 5,
},
radioCircle: {
width: 16,
height: 16,
borderRadius: 8,
borderWidth: 2,
borderColor: primaryColor,
marginRight: 8,
backgroundColor: '#fff',
},
radioCircleSelected: {
backgroundColor: primaryColor,
},
genderText: {
fontSize: 14,
color: textColorDark,
},
inputGroup: {
width: '100%',
marginBottom: 20,
},
inputLabel: {
fontSize: 16,
fontWeight: '600',
color: textColorDark,
marginBottom: 8,
},
inputContainer: {
flexDirection: 'row',
alignItems: 'center',
borderWidth: 1,
borderColor: lightPurple,
borderRadius: 25,
paddingHorizontal: 15,
height: 50,
},
input: {
flex: 1,
fontSize: 14,
color: textColorDark,
},
inputPassword: {
borderWidth: 1,
borderColor: lightPurple,
borderRadius: 25,
paddingHorizontal: 15,
height: 50,
fontSize: 14,
color: textColorDark,
},
textArea: {
borderWidth: 1,
borderColor: lightPurple,
borderRadius: 15,
paddingHorizontal: 15,
paddingVertical: 12,
height: 100,
fontSize: 14,
color: textColorDark,
},
saveButton: {
width: 60,
height: 60,
borderRadius: 30,
backgroundColor: primaryColor,
justifyContent: 'center',
alignItems: 'center',
alignSelf: 'center',
marginTop: 20,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.2,
shadowRadius: 6,
elevation: 8,
},
});