import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

const loadStoredAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');
    const userName = await AsyncStorage.getItem('userName');

    console.log('🔍 Token carregado:', token);
    console.log('🔍 UserId carregado:', userId);

    if (token && userId) {
      setUser({ token, userId, userName });
      console.log('✅ Usuário autenticado');
    } else {
      setUser(null);
      console.log('❌ Usuário NÃO autenticado');
    }
  } catch (error) {
    console.error('Erro ao carregar autenticação:', error);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const login = async (token, userId, userName) => {
    try {
      await AsyncStorage.setItem('userToken', String(token));
      await AsyncStorage.setItem('userId', String(userId));
      if (userName) {
        await AsyncStorage.setItem('userName', String(userName));
      }
      setUser({ token, userId, userName });
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userId', 'userName']);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

const isAuthenticated = () => {
  return user !== null && user !== undefined && user.token !== null && user.token !== undefined;
};

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};