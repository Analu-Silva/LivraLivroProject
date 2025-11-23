import AsyncStorage from '@react-native-async-storage/async-storage';

//Mudar o endereço IP para o do seu computador, onde esta rodando o docker
const API_BASE_URL = 'http://192.168.0.103:8765';

export const getAuthHeaders = async () => {
	const token = await AsyncStorage.getItem('userToken');
	return {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	};
};

export const fetchWithAuth = async (url, options = {}) => {
	const headers = await getAuthHeaders();
  
	const config = {
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	};

	const response = await fetch(url, config);
  
	// Se não autorizado (401), limpa credenciais armazenadas para forçar novo login
	if (response.status === 401) {
		await AsyncStorage.multiRemove(['userToken', 'userId', 'userName']);
	}
  
	return response;
};

export default API_BASE_URL;