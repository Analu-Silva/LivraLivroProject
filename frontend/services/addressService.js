import API_BASE_URL, { fetchWithAuth } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Monta cabeçalhos extras (X-User-Id, X-User-Type)
const buildExtraHeaders = async () => {
    const headers = { 'Content-Type': 'application/json' };
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (userId) headers['X-User-Id'] = userId;
        headers['X-User-Type'] = userType ?? '0';
    } catch (e) {
        // ignora
    }
    return headers;
};

export const createAddress = async (userId, addressData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/address`, {
            method: 'POST',
            headers: extra,
            body: JSON.stringify(addressData),
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar endereço');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em createAddress:', error);
        throw error;
    }
};

export const updateAddress = async (userId, addressData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/address`, {
            method: 'PATCH',
            headers: extra,
            body: JSON.stringify(addressData),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o endereço');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em updateAddress:', error);
        throw error;
    }
};

export const getAddress = async (userId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/address`, {
            method: 'GET',
            headers: extra,
        });

        if (!response.ok) {
            // se endereço não existe, retornar null para permitir fallback nos chamadores
            if (response.status === 404) return null;
            throw new Error('Erro ao buscar o endereço');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getAddress:', error);
        throw error;
    }
};
