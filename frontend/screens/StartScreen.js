import React, { useEffect } from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';

export default function StartScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('PreHome'); // ← Vai para PreHome (que tem o modal)
    }, 2500); // 2.5 segundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        {/* Logo (ícone roxo) */}
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Texto LivraLivro */}
        <Image
          source={require('../assets/LivraLivro.png')}
          style={styles.textLogo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 222,
    height: 147,
    marginBottom: -8,
  },
  textLogo: {
    width: 170,
    height: 26,
  },
});
