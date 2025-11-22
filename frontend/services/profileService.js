import API_BASE_URL from './api';

export const createProfileDetails = async (userId, detailsData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/details`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(detailsData),
});

if (!response.ok) {
    throw new Error('Erro ao criar detalhes do perfil');
}

return await response.json();
} catch (error) {
console.error('Erro em createProfileDetails:', error);
throw error;
}
};

export const updateProfileDetails = async (userId, detailsData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/details`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(detailsData),
});

if (!response.ok) {
    throw new Error('Erro ao atualizar detalhes do perfil');
}

return await response.json();
} catch (error) {
console.error('Erro em updateProfileDetails:', error);
throw error;
}
};

export const getProfileDetails = async (userId) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/details`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (!response.ok) {
    throw new Error('Erro ao buscar detalhes do perfil');
}

return await response.json();
} catch (error) {
console.error('Erro em getProfileDetails:', error);
throw error;
}
};

export const updateProfileInfo = async (userId, infoData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/info`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(infoData),
});

if (!response.ok) {
    throw new Error('Erro ao atualizar informações do perfil');
}

return await response.json();
} catch (error) {
console.error('Erro em updateProfileInfo:', error);
throw error;
}
};

export const getProfileInfo = async (userId) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/profile/${userId}/info`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (!response.ok) {
    throw new Error('Erro ao buscar informações do perfil');
}

return await response.json();
} catch (error) {
console.error('Erro em getProfileInfo:', error);
throw error;
}
};