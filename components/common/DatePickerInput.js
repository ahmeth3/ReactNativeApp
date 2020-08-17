import React from 'react';
import { Text, StyleSheet, TouchableOpacity, txtStyle } from 'react-native';

const DatePickerInput = ({ onPress, value, containerPropsStyle }) => {
  const { inputStyle, containerStyle, button } = styles;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...containerStyle, ...containerPropsStyle }}
    >
      <Text style={{ ...inputStyle, ...txtStyle }}>{value}</Text>
    </TouchableOpacity>
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
    flexDirection: 'row',
  },
  inputStyle: {
    alignSelf: 'center',
    color: 'rgb(27,41,69)',
    paddingLeft: 20,
    fontSize: 18,
    lineHeight: 23,
    flex: 3,
  },
});

export { DatePickerInput };
