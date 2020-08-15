import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const DatePickerInput = ({ onPress, value, placeholder }) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={containerStyle}>
      <TextInput
        placeholderTextColor={'rgb(27,41,69)'}
        placeholder={placeholder}
        value={value}
        style={inputStyle}
        editable={false}
        onTouchStart={onPress}
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
  },
});

export { DatePickerInput };
