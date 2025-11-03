import React from 'react'; 
import HomeScreen from './HomeScreen';

export default function PreHomeScreen() {
  // Simplesmente renderiza a HomeScreen com a prop showModalOnClick = true
    return <HomeScreen showModalOnClick={true} />;
}