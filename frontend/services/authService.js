import API_BASE_URL, { fetchWithAuth } from './api';

// Cadastro de usuário (signup) com logs e tentativa de extrair detalhes do erro
export const signup = async (userData) => {
    try {
        console.log('📤 Enviando cadastro:', userData);
        console.log('📍 URL:', `${API_BASE_URL}/auth/signup`);

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        console.log('📥 Status da resposta:', response.status);

        if (!response.ok) {
            // Tentar pegar detalhes do erro
            let errorDetails = null;
            try {
                const text = await response.text();
                console.log('❌ Erro do backend:', text);
                try {
                    errorDetails = JSON.parse(text);
                } catch (e) {
                    errorDetails = text;
                }
            } catch (e) {
                console.log('❌ Não foi possível ler o erro');
            }

            const message = (errorDetails && errorDetails.message) || 
                (typeof errorDetails === 'string' ? errorDetails : null) || 
                `Erro ao fazer cadastro (${response.status})`;
            throw new Error(message);
        }

        const result = await response.json();
        console.log('✅ Cadastro bem-sucedido:', result);
        return result;
    } catch (error) {
        console.error('Erro em signup', error);
        throw error;
    }
};

// Login (signin) com parsing de erro mais robusto
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
            let details = null;
            try {
                const txt = await response.text();
                try {
                    details = JSON.parse(txt);
                } catch (e) {
                    details = txt;
                }
            } catch (e) {
                // ignora
            }

            const message = (details && details.message) || 
                                         (typeof details === 'string' ? details : null) || 
                                         `Erro ao fazer login (${response.status})`;
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

// Atualiza credenciais usando fetchWithAuth (autenticado)
export const updateCredentials = async (userId, credentialsData) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/auth/credentials/${userId}`, {
            method: 'PATCH',
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

// Busca e-mail do usuário autenticado
export const getEmail = async () => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/auth/credentials/`, {
            method: 'GET',
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

// Deleta a conta do usuário (autenticado)
export const deleteAccount = async (userId) => {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/ws/auth/deleteAccount/${userId}`, {
            method: 'DELETE',
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