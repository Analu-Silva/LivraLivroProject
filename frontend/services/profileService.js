import API_BASE_URL, { fetchWithAuth } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Monta cabeçalhos extras (X-User-Id, X-User-Type, X-User-Email)
const buildExtraHeaders = async () => {
    const headers = {};
    try {
        const userId = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (userId) headers['X-User-Id'] = userId;
        headers['X-User-Type'] = userType ?? '0';
        if (userEmail) headers['X-User-Email'] = userEmail;
    } catch (e) {
        // ignora
    }
    return headers;
};

export const createProfileDetails = async (userId, detailsData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/details`, {
            method: 'POST',
            body: JSON.stringify(detailsData),
            headers: extra,
        });
        if (!response.ok) throw new Error('Erro ao criar detalhes do perfil');
        return await response.json();
    } catch (error) {
        console.error('Erro em createProfileDetails:', error);
        throw error;
    }
};

export const updateProfileDetails = async (userId, detailsData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/details`, {
            method: 'PATCH',
            body: JSON.stringify(detailsData),
            headers: extra,
        });
        if (!response.ok) throw new Error('Erro ao atualizar detalhes do perfil');
        return await response.json();
    } catch (error) {
        console.error('Erro em updateProfileDetails:', error);
        throw error;
    }
};

export const getProfileDetails = async (userId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/details`, {
            method: 'GET',
            headers: extra,
        });
        if (!response.ok) throw new Error('Erro ao buscar detalhes do perfil');
        return await response.json();
    } catch (error) {
        console.error('Erro em getProfileDetails:', error);
        throw error;
    }
};

export const updateProfileInfo = async (userId, infoData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/info`, {
            method: 'PATCH',
            body: JSON.stringify(infoData),
            headers: extra,
        });
        if (!response.ok) throw new Error('Erro ao atualizar informações do perfil');
        return await response.json();
    } catch (error) {
        console.error('Erro em updateProfileInfo:', error);
        throw error;
    }
};

export const getProfileInfo = async (userId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/profile/${userId}/info`, {
            method: 'GET',
            headers: extra,
        });
        if (!response.ok) throw new Error('Erro ao buscar informações do perfil');
        return await response.json();
    } catch (error) {
        console.error('Erro em getProfileInfo:', error);
        throw error;
    }
};