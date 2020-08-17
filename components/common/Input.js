import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const Input = ({
  value,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  onChangeText,
}) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={'rgb(27,41,69)'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        autoCorrect={false}
        style={inputStyle}
      />
    </View>
  );
};

const styles = new StyleSheet.create({
  containerStyle: {
    width: '100%',
    height: 55,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255, 0.85)',
    borderColor: 'rgba(27,41,69, 0.9)',
    borderWidth: 1,
    borderRadius: 20,
  },
  inputStyle: {
    width: '100%',
    paddingLeft: 20,
    fontSize: 18,
    lineHeight: 23,
    flex: 3,
    color: 'rgb(27,41,69)',
  },
});

export { Input };
