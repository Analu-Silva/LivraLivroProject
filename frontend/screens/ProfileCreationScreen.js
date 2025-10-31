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

export default function ProfileCreationScreen({ navigation }) {
const [profileImage, setProfileImage] = useState(null);
const [gender, setGender] = useState('');
const [description, setDescription] = useState('');

const handleImagePick = () => {
    Alert.alert('Foto de Perfil', 'Funcionalidade de escolher foto será implementada');
};

const handleContinue = () => {
    if (!gender) {
    Alert.alert('Atenção', 'Por favor, selecione seu gênero');
    return;
    }
    Alert.alert('Perfil criado com sucesso!');
    navigation.navigate('Home');
};

return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.frame}>
        
        {/* Foto de perfil com círculo */}
        <TouchableOpacity 
            style={styles.imageContainer}
            onPress={handleImagePick}
        >
            <Image
            source={profileImage ? { uri: profileImage } : require('../assets/perfil sem foto.png')}
            style={styles.intersect}
            />
            
            {/* Botão de editar (verde) */}
            <View style={styles.editButton}>
            <Feather name="edit-2" size={20} color="white" />
            </View>
        </TouchableOpacity>

        {/* Texto de boas-vindas */}
        <Text style={styles.greeting}>Olá, Priscila!</Text>
        <Text style={styles.subGreeting}>Complete seu perfil.</Text>

        {/* Seção de Gênero */}
        <Text style={styles.sectionLabel}>Gênero</Text>

        {/* Opções de gênero */}
        <View style={styles.genderOptions}>
            {/* Masculino */}
            <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender('masculino')}
            >
            <View style={[
                styles.radioCircle,
                gender === 'masculino' && styles.radioCircleSelected,
            ]}>
                {gender === 'masculino' && (
                <Feather name="check" size={8} color={primaryColor} />
                )}
            </View>
            <Text style={styles.genderText}>Masculino</Text>
            </TouchableOpacity>

            {/* Feminino */}
            <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGender('feminino')}
            >
            <View style={[
                styles.radioCircle,
                gender === 'feminino' && styles.radioCircleSelected,
            ]}>
                {gender === 'feminino' && (
                <Feather name="check" size={8} color={primaryColor} />
                )}
            </View>
            <Text style={styles.genderText}>Feminino</Text>
            </TouchableOpacity>

            {/* Outro */}
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

        {/* Não informar (em linha separada) */}
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

        {/* Seção de Descrição */}
        <Text style={styles.descriptionLabel}>Descrição</Text>

        <TextInput
            style={styles.descriptionInput}
            placeholder="Nos fale mais sobre você..."
            placeholderTextColor="#9352b2"
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
        />

        {/* Botão de Continuar (check roxo) */}
        <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
        >
            <Feather name="check" size={21} color="white" />
        </TouchableOpacity>

        </View>

    </ScrollView>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
},
container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 50,
},
frame: {
    width: 265,
    position: 'relative',
},
imageContainer: {
    width: 224,
    height: 224,
    marginLeft: 16,
    marginTop: 30,
    position: 'relative',
},
intersect: {
    width: 224,
    height: 224,
    borderRadius: 112,
    resizeMode: 'cover',
},
editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
},
greeting: {
    position: 'absolute',
    top: 271,
    left: 44,
    width: 204,
    fontSize: 32,
    fontWeight: '700',
    color: primaryColor,
    letterSpacing: 0,
    lineHeight: 38,
},
subGreeting: {
    position: 'absolute',
    top: 314,
    left: 58,
    width: 147,
    fontSize: 16,
    fontWeight: '700',
    color: primaryColor,
    letterSpacing: 0,
    lineHeight: 19,
},
sectionLabel: {
    position: 'absolute',
    top: 363,
    left: 10,
    width: 183,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 19,
},
genderOptions: {
    position: 'absolute',
    top: 394,
    left: 10,
    flexDirection: 'row',
    gap: 20,
},
genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
},
genderOptionSingle: {
    position: 'absolute',
    top: 423,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
},
radioCircle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.5,
    borderColor: primaryColor,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
},
radioCircleSelected: {
    backgroundColor: primaryColor,
},
genderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 16,
},
descriptionLabel: {
    position: 'absolute',
    top: 463,
    left: 10,
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    letterSpacing: 0,
    lineHeight: 19,
},
descriptionInput: {
    position: 'absolute',
    top: 484,
    left: -2,
    width: 268,
    height: 133,
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingTop: 9,
    fontSize: 14,
    fontWeight: '700',
    color: '#9352b2',
    letterSpacing: 0,
},
continueButton: {
    position: 'absolute',
    top: 647,
    left: 230,
    width: 43,
    height: 43,
    borderRadius: 21.5,
    borderWidth: 3,
    borderColor: primaryColor,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
},
});