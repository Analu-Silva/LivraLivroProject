import React from 'react';
import {
View,
Text,
TouchableOpacity,
StyleSheet,
SafeAreaView,
Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const primaryColor = '#B431F4';
const textColorDark = '#333';
const dangerColor = '#FF4444';

export default function MenuScreen({ navigation }) {

const handleLogout = () => {
    Alert.alert(
    'Sair',
    'Tem certeza que deseja sair da sua conta?',
    [
        {
        text: 'Cancelar',
        style: 'cancel',
        },
        {
        text: 'Sair',
        onPress: () => {
            // Aqui você pode limpar o AsyncStorage/Context
            navigation.reset({
            index: 0,
            routes: [{ name: 'PreHome' }],
            });
        },
        style: 'destructive',
        },
    ],
    { cancelable: true }
    );
};

const handleDeleteAccount = () => {
    Alert.alert(
    'Excluir Conta',
    'Tem certeza? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.',
    [
        {
        text: 'Cancelar',
        style: 'cancel',
        },
        {
        text: 'Excluir',
        onPress: () => {
            // Aqui você faria a requisição para excluir a conta
            Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
            navigation.reset({
            index: 0,
            routes: [{ name: 'PreHome' }],
            });
        },
        style: 'destructive',
        },
    ],
    { cancelable: true }
    );
};

return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
        
        {/* Header com botão de voltar */}
        <View style={styles.header}>
        <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Feather name="arrow-left" size={24} color={primaryColor} />
            <Text style={styles.menuText}>Menu</Text>
        </TouchableOpacity>
        </View>

        {/* Lista de opções do menu */}
        <View style={styles.menuList}>
        
        {/* Configurações */}
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')} 
        >
            <Text style={styles.menuItemText}>Configurações</Text>
            <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        {/* Sacola */}
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Sacola')}
        >
            <Text style={styles.menuItemText}>Sacola</Text>
            <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        {/* Suas vendas */}
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Vendas')}
        >
            <Text style={styles.menuItemText}>Suas vendas</Text>
            <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        {/* Suas compras */}
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Compra')}
        >
            <Text style={styles.menuItemText}>Suas compras</Text>
            <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        {/* Sair */}
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
        >
            <Text style={styles.menuItemText}>Sair</Text>
            <Feather name="chevron-right" size={20} color={textColorDark} />
        </TouchableOpacity>

        {/* Excluir conta (em vermelho) */}
        <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={handleDeleteAccount}
        >
            <Text style={styles.menuItemTextDanger}>Excluir conta</Text>
            <Feather name="chevron-right" size={20} color={dangerColor} />
        </TouchableOpacity>

        </View>

    </View>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
safeArea: {
    flex: 1,
    backgroundColor: '#fff',
},
container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
},
header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
},
backButton: {
    flexDirection: 'row',
    alignItems: 'center',
},
menuText: {
    fontSize: 20,
    fontWeight: '600',
    color: primaryColor,
    marginLeft: 10,
},
menuList: {
    flex: 1,
},
menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
},
menuItemLast: {
    borderBottomWidth: 0,
},
menuItemText: {
    fontSize: 18,
    fontWeight: '400',
    color: textColorDark,
},
menuItemTextDanger: {
    fontSize: 18,
    fontWeight: '400',
    color: dangerColor,
},
});