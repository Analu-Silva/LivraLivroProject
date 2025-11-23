import API_BASE_URL, { fetchWithAuth } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileInfo } from './profileService';

// Monta cabeçalhos extras necessários para o backend (X-User-Id, X-User-Type, X-User-Email)
const buildExtraHeaders = async () => {
    const headers = { 'Content-Type': 'application/json' };
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        const userType = await AsyncStorage.getItem('userType');
        let userEmail = await AsyncStorage.getItem('userEmail');

        // se não temos email armazenado, tenta buscar no profile
        if (!userEmail && userId) {
            try {
                const info = await getProfileInfo(userId);
                if (info && info.email) userEmail = info.email;
            } catch (e) {
                // ignora
            }
        }

        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (userId) headers['X-User-Id'] = userId;
        headers['X-User-Type'] = userType ?? '0';
        if (userEmail) headers['X-User-Email'] = userEmail;
    } catch (e) {
        // ignora
    }
    return headers;
};

export const getOrders = async (currency = 'BRL') => {
    try {
        // usar fetchWithAuth para manter comportamento centralizado (clear on 401)
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/orders/${currency}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getOrders:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/orders`, {
            method: 'POST',
            headers: extra,
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const txt = await response.text();
            console.error('Erro ao criar pedido, status:', response.status, 'body:', txt);
            throw new Error(`Erro ao criar pedido (${response.status}): ${txt}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em createOrder:', error);
        throw error;
    }
};