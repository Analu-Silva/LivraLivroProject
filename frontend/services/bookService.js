import API_BASE_URL from './api';

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

export const createBook = async (bookData) => {
try {
const response = await fetch(`${API_BASE_URL}/ws/books`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
});

if (!response.ok) {
    throw new Error('Erro ao cradastrar o livro');
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
