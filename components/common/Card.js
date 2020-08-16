import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({ children, style }) => {
  const { container } = styles;
  return <View style={{ ...container, ...style }}>{children}</View>;
};

const styles = new StyleSheet.create({
  container: {
    height: 65,
    width: '80%',
    backgroundColor: 'rgb(27,41,69)',
    marginTop: 5,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export { Card };
