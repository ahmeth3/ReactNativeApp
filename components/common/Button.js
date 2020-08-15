import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ onPress, children, style, btnStyle, txtStyle }) => {
  const { button, text } = styles;
  return (
    <View style={style}>
      <TouchableOpacity onPress={onPress} style={{ ...button, ...btnStyle }}>
        <Text style={{ ...text, ...txtStyle }}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = new StyleSheet.create({
  text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    paddingTop: 10,
    paddingBottom: 5,
    zIndex: 0,
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'rgb(27,41,69)',
    borderRadius: 25,
    zIndex: -100000,
  },
});

export { Button };
