import API_BASE_URL from './api';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOUDINARY_CLOUD_NAME = 'dewylt7wu';
const CLOUDINARY_UPLOAD_PRESET = 'LivraLivro';

export const getBookById = async (bookId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}/BRL`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar livro');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em getBookById:', error);
        throw error;
    }
};

export const uploadToCloudinary = async (uri) => {
    try {
        if (!uri) throw new Error('uploadToCloudinary: uri is undefined');

        let serverSig = null;
        try {
            const sigRes = await fetch(`${API_BASE_URL}/ws/cloudinary/signature`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (sigRes.ok) {
                serverSig = await sigRes.json();
                console.log('Assinatura obtida do servidor:', serverSig);
            } else {
                console.warn('Falha ao obter assinatura do servidor:', sigRes.status);
            }
        } catch (e) {
            console.warn('Não foi possível obter assinatura do servidor:', e.message);
        }

        const cloudName = (serverSig && serverSig.cloudName) ? serverSig.cloudName : CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error('Cloudinary cloud name não configurado');
        }

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();

        const filename = uri && uri.split ? uri.split('/').pop() : `photo_${Date.now()}.jpg`;
        const match = (filename || '').match(/\.([0-9a-z]+)(?:[?#]|$)/i);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        console.log('Upload iniciado:', { filename, type, cloudName });

        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('file', blob, filename);
        } else {
            formData.append('file', { uri, name: filename, type });
        }

        if (serverSig && serverSig.signature && serverSig.timestamp) {
            console.log('Usando assinatura do servidor');
            formData.append('api_key', serverSig.apiKey);
            formData.append('timestamp', serverSig.timestamp);
            formData.append('signature', serverSig.signature);
            if (serverSig.uploadPreset) {
                formData.append('upload_preset', serverSig.uploadPreset);
            }
        } else if (CLOUDINARY_UPLOAD_PRESET) {
            console.log('Usando upload preset');
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        } else {
            throw new Error('Nenhuma credencial Cloudinary disponível');
        }

        const res = await fetch(url, { 
            method: 'POST', 
            body: formData 
        });

        console.log('Resposta do Cloudinary:', res.status);

        if (!res.ok) {
            const txt = await res.text();
            console.error('Erro do Cloudinary:', txt);
            throw new Error(`Upload Cloudinary falhou: ${res.status}`);
        }

        const json = await res.json();
        
        if (!json.secure_url) {
            throw new Error('Resposta do Cloudinary sem URL segura');
        }

        console.log('Upload bem-sucedido:', json.secure_url);
        return json.secure_url;

    } catch (error) {
        console.error('Erro em uploadToCloudinary:', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            headers['X-User-Id'] = userId;
            headers['X-User-Type'] = '1'; // 1 = vendedor
        }

        const response = await fetch(`${API_BASE_URL}/ws/books`, {
            method: 'POST',
            headers,
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            let parsed = null;
            try { 
                parsed = await response.json(); 
            } catch (e) {
                try { 
                    const txt = await response.text(); 
                    parsed = { message: txt }; 
                } catch (e2) { 
                    parsed = { message: `Erro ao cadastrar o livro (${response.status})` }; 
                }
            }
            
            const err = new Error(parsed.message || `Erro ao cadastrar o livro (${response.status})`);
            err.status = response.status;
            err.body = parsed;
            throw err;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em createBook:', error);
        throw error;
    }
};

// ========== Busca livros do vendedor logado ==========
export const getUserBooks = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        
        if (!userId) {
            throw new Error('ID do usuário não encontrado');
        }

        console.log('Buscando livros do usuário:', userId);

        // Usa o endpoint do OpenBookController: GET /books/BRL?author={sellerId}
        const response = await fetch(`${API_BASE_URL}/books/BRL?author=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.warn(`Erro ao buscar vendas (${response.status})`);
            return [];
        }

        const data = await response.json();
        
        // OpenBookController retorna Page<BookEntity>, então pegamos o content
        const books = data.content || data || [];
        console.log('Livros recebidos:', Array.isArray(books) ? books.length : 0);
        
        // Ordena por mais recente primeiro (inverte a ordem)
        return Array.isArray(books) ? books.reverse() : [];
    } catch (error) {
        console.error('Erro em getUserBooks:', error);
        throw error;
    }
};

// ========== Busca todos os livros ==========
export const getAllBooks = async () => {
    try {
        const url = `${API_BASE_URL}/books/BRL`;

        console.log('Buscando todos os livros:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.warn(`Erro ao buscar livros (${response.status})`);
            return [];
        }

        const data = await response.json();
        
        // OpenBookController retorna Page<BookEntity>, então pegamos o content
        const books = data.content || data || [];
        console.log('Total de livros recebidos:', Array.isArray(books) ? books.length : 0);
        
        return Array.isArray(books) ? books : [];
    } catch (error) {
        console.error('Erro em getAllBooks:', error);
        throw error;
    }
};

// ========== Busca livros por gênero ==========
export const getBooksByGenre = async (genreId) => {
    try {
        const url = `${API_BASE_URL}/books/BRL?genreId=${genreId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.warn(`Erro ao buscar livros por gênero (${response.status})`);
            return [];
        }

        const data = await response.json();
        const books = data.content || data || [];
        
        return Array.isArray(books) ? books : [];
    } catch (error) {
        console.error('Erro em getBooksByGenre:', error);
        throw error;
    }
};

// ========== Busca livros por pesquisa ==========
export const searchBooks = async (searchTerm) => {
    try {
        const url = `${API_BASE_URL}/books/BRL?search=${encodeURIComponent(searchTerm)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.warn(`Erro ao buscar livros (${response.status})`);
            return [];
        }

        const data = await response.json();
        const books = data.content || data || [];
        
        return Array.isArray(books) ? books : [];
    } catch (error) {
        console.error('Erro em searchBooks:', error);
        throw error;
    }
};

export const updateBook = async (bookId, bookData) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            headers['X-User-Id'] = userId;
            headers['X-User-Type'] = '1';
        }

        const response = await fetch(`${API_BASE_URL}/ws/books/${bookId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar o livro');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em updateBook:', error);
        throw error;
    }
};

export const deleteBook = async (bookId) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            headers['X-User-Id'] = userId;
            headers['X-User-Type'] = '1';
        }

        const response = await fetch(`${API_BASE_URL}/ws/books/${bookId}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar o livro');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro em deleteBook:', error);
        throw error;
    }
};