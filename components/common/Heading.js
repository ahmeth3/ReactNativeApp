import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Heading = ({ style, children }) => {
  const { button, text } = styles;
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
};

const styles = {
  text: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
};

export { Heading };
