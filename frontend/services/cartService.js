import API_BASE_URL from './api';

export const getCart = async (currency = 'BRL') => {
    try {
        const response = await fetch(`${API_BASE_URL}/ws/cart?targetCurrency=${currency}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_BASE_URL}/ws/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(
        `${API_BASE_URL}/ws/cart/items/${itemId}?quantity=${quantity}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        }
    );

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
    const response = await fetch(`${API_BASE_URL}/ws/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_BASE_URL}/ws/cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error('Erro ao esvaziar carrinho');
    }
    } catch (error) {
    console.error('Erro em clearCart:', error);
    throw error;
    }
};
