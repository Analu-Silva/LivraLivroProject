import React from 'react'; 
import HomeScreen from './HomeScreen';

export default function PreHomeScreen() {
  // Passa uma prop indicando que deve mostrar modal ao clicar nos livros
  return <HomeScreen requireLoginOnBookClick={true} />;
}