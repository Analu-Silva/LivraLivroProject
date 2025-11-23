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

export const getCart = async (currency = 'BRL') => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/cart?targetCurrency=${currency}`, {
            method: 'GET',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar o carrinho');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getCart:', error);
        throw error;
    }
};

export const addToCart = async (bookId, quantity = 1) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/cart/items`, {
            method: 'POST',
            headers: extra,
            body: JSON.stringify({ bookId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar item ao carrinho');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em addToCart:', error);
        throw error;
    }
};

export const updateCartItemQuantity = async (itemId, quantity) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/cart/items/${itemId}?quantity=${quantity}`, {
            method: 'PATCH',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar quantidade');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em updateCartItemQuantity:', error);
        throw error;
    }
};

export const removeCartItem = async (itemId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/cart/items/${itemId}`, {
            method: 'DELETE',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao remover item do carrinho');
        }
    } catch (error) {
        console.error('Erro em removeCartItem:', error);
        throw error;
    }
};

export const clearCart = async () => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/cart`, {
            method: 'DELETE',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao esvaziar carrinho');
        }
    } catch (error) {
        console.error('Erro em clearCart:', error);
        throw error;
    }
};
