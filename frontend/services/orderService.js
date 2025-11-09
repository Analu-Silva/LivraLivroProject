import API_BASE_URL from './api';

export const getOrders = async (currency = 'BRL') => {
try {
const response = await fetch(`${API_BASE_URL}/ws/orders/${currency}`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
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
const response = await fetch(`${API_BASE_URL}/ws/orders`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
});

if (!response.ok) {
    throw new Error('Erro ao criar pedido');
}

return await response.json();
} catch (error) {
console.error('Erro em createOrder:', error);
throw error;
}
};