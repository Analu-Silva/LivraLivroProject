import API_BASE_URL from './api';

export const getWishlist = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ws/wishlist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(
        `${API_BASE_URL}/ws/wishlist/items?page=${page}&size=${size}&sort=${sort}&currency=${currency}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${API_BASE_URL}/ws/wishlist/check/${bookId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${API_BASE_URL}/ws/wishlist/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${API_BASE_URL}/ws/wishlist/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${API_BASE_URL}/ws/wishlist/items/book/${bookId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`${API_BASE_URL}/ws/wishlist/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao limpar wishlist');
        }
    } catch (error) {
        console.error('Erro em clearWishlist:', error);
        throw error;
    }
};
