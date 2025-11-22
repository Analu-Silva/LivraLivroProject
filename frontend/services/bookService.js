import API_BASE_URL from './api';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOUDINARY_CLOUD_NAME = 'dewylt7wuv';
const CLOUDINARY_UPLOAD_PRESET = '';

export const getBookById = async (bookId) => {
try {
const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
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
            const sigRes = await fetch(`${API_BASE_URL}/ws/cloudinary/signature`);
            if (sigRes.ok) serverSig = await sigRes.json();
        } catch (e) {
        }

        const cloudName = serverSig && serverSig.cloudName ? serverSig.cloudName : CLOUDINARY_CLOUD_NAME;
        if (!cloudName) throw new Error('Cloudinary cloud name not configured on server or frontend');

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();

        const filename = uri && uri.split ? uri.split('/').pop() : `photo_${Date.now()}.jpg`;
        const match = (filename || '').match(/\.([0-9a-z]+)(?:[?#]|$)/i);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('file', blob, filename);
        } else {
            formData.append('file', { uri, name: filename, type });
        }

        if (serverSig && serverSig.signature && serverSig.timestamp && serverSig.apiKey) {
            formData.append('api_key', serverSig.apiKey);
            formData.append('timestamp', serverSig.timestamp);
            formData.append('signature', serverSig.signature);
            if (serverSig.uploadPreset) formData.append('upload_preset', serverSig.uploadPreset);
        } else if (CLOUDINARY_UPLOAD_PRESET) {
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        } else {
            throw new Error('No Cloudinary credentials available (server signature or frontend upload preset)');
        }

        const res = await fetch(url, { method: 'POST', body: formData });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
        }
        const json = await res.json();
        if (!json.secure_url) throw new Error('Cloudinary response missing secure_url');
        return json.secure_url;
    } catch (error) {
        console.error('Erro em uploadToCloudinary:', error);
        throw error;
    }
};

export const createBook = async (bookData) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/ws/books`, {
            method: 'POST',
            headers,
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            // try to parse JSON error body for structured messages
            let parsed = null;
            try { parsed = await response.json(); } catch (e) {
                try { const txt = await response.text(); parsed = { message: txt }; } catch (e2) { parsed = { message: `Erro ao cadastrar o livro (${response.status})` }; }
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

export const updateBook = async (bookId, bookData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/books/${bookId}`, {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json',
    },
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
const response = await fetch(`${API_BASE_URL}/ws/books/${bookId}`, {
    method: 'DELETE',
    headers: {
    'Content-Type': 'application/json',
    },
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
