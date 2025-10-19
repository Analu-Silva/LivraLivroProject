// components/CustomInput.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';

const primaryColor = '#B431F4'; // cor do texto/borda (seu original)
const textColor = '#333333';
const lightPurple = '#DAB8F7'; // placeholder

export default function CustomInput({
  label = '',
  value = '',
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  errorMessage = '',
  maxLength,
  showValidationIcon = false,
  isValid = true,             
  ...props
}) {
  const showIcon = showValidationIcon && value.length > 0;
  const iconSource = isValid
    ? require('../assets/right icon.png')
    : require('../assets/wrong icon.png');

  return (
    <View style={styles.inputGroup}>
      {label.length > 0 && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={lightPurple}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          {...props}
        />

        {showIcon && (
          <Image
            source={iconSource}
            style={styles.icon}
            resizeMode="contain"
          />
        )}
      </View>

      {/* se showValidationIcon estiver true, a gente NÃO mostra o texto de erro (ícone substitui) */}
      {!showValidationIcon && errorMessage.length > 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    width: '85%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: textColor,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 48,
    borderColor: primaryColor,
    borderWidth: 1.1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: primaryColor, 
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 16.5,
    width: 15,
    height: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
