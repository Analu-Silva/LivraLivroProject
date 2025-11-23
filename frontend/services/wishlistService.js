import API_BASE_URL, { fetchWithAuth } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Monta cabeçalhos extras (X-User-Id, X-User-Type)
const buildExtraHeaders = async () => {
    const headers = { 'Content-Type': 'application/json' };
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (userId) headers['X-User-Id'] = userId;
        const userType = await AsyncStorage.getItem('userType');
        headers['X-User-Type'] = userType ?? '0';
    } catch (e) {
        // ignora
    }
    return headers;
};

export const getWishlist = async () => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist`, {
            method: 'GET',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar a wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getWishlist:', error);
        throw error;
    }
};

export const getWishlistItemsPaginated = async (page = 0, size = 10, sort = 'id,asc', currency = 'BRL') => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(
            `${API_BASE_URL}/ws/wishlist/items?page=${page}&size=${size}&sort=${sort}&currency=${currency}`,
            {
                method: 'GET',
                headers: extra,
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar itens da wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getWishlistItemsPaginated:', error);
        throw error;
    }
};


export const checkBookInWishlist = async (bookId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist/check/${bookId}`, {
            method: 'GET',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar livro na wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em checkBookInWishlist:', error);
        throw error;
    }
};

export const addToWishlist = async (bookId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist/items`, {
            method: 'POST',
            headers: extra,
            body: JSON.stringify({ bookId }),
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar livro à wishlist');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em addToWishlist:', error);
        throw error;
    }
};

export const removeWishlistItemById = async (itemId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist/items/${itemId}`, {
            method: 'DELETE',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao remover item da wishlist');
        }
    } catch (error) {
        console.error('Erro em removeWishlistItemById:', error);
        throw error;
    }
};

export const removeWishlistItemByBook = async (bookId) => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist/items/book/${bookId}`, {
            method: 'DELETE',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao remover livro da wishlist');
        }
    } catch (error) {
        console.error('Erro em removeWishlistItemByBook:', error);
        throw error;
    }
};

export const clearWishlist = async () => {
    try {
        const extra = await buildExtraHeaders();
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/wishlist/clear`, {
            method: 'DELETE',
            headers: extra,
        });

        if (!response.ok) {
            throw new Error('Erro ao limpar wishlist');
        }
    } catch (error) {
        console.error('Erro em clearWishlist:', error);
        throw error;
    }
};
