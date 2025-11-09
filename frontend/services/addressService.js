import API_BASE_URL from './api';

export const createAddress = async (userId, addressData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/address`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
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
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/address`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
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
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/address`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (!response.ok) {
    throw new Error('Erro ao buscar o endereço');
}

return await response.json();
} catch (error) {
console.error('Erro em getAddress:', error);
throw error;
}
};
