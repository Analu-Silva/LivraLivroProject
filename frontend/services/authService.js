import API_BASE_URL from './api';

export const signup = async (userData) => {
try {
const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
});

if (!response.ok) {
    throw new Error('Erro ao fazer cadastro');
}

return await response.json();
} catch (error) {
console.error('Erro em signup', error);
throw error;
}
};

export const signin = async (email, password) => {
try {
const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
});

if (!response.ok) {
        // Try to obtain error details from the backend
        let details = null;
        try {
            const txt = await response.text();
            // try parse JSON
            try {
                details = JSON.parse(txt);
            } catch (e) {
                details = txt;
            }
        } catch (e) {
            // ignore
        }

        const message = (details && details.message) || (typeof details === 'string' ? details : null) || `Erro ao fazer login (${response.status})`;
        const err = new Error(message);
        err.status = response.status;
        throw err;
}

return await response.json();
} catch (error) {
console.error('Erro em signin', error);
throw error;
}
};

export const updateCredentials = async (userId, credentialsData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/auth/credentials/${userId}`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentialsData),
});

if (!response.ok) {
    throw new Error('Erro ao atualizar as credenciais');
}

return await response.json();
} catch (error) {
console.error('Erro em updateCredentials:', error);
throw error;
}
};

export const getEmail = async () => {
try {
const response = await fetch(`${API_BASE_URL}/ws/auth/credentials/`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (!response.ok) {
    throw new Error('Erro ao buscar e-mail');
}

return await response.json();
} catch (error) {
console.error('Erro em getEmail:', error);
throw error;
}
};

export const deleteAccount = async (userId) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/auth/deleteAccount/${userId}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (!response.ok) {
    throw new Error('Erro ao deletar conta');
}

return await response.json();
} catch (error) {
console.error('Erro em deleteAccount:', error);
throw error;
}
};