import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loading = ({ style, spinnerStyle, size }) => {
  return (
    <View style={{ ...styles.spinnerContainer, ...style }}>
      <ActivityIndicator size={size} style={spinnerStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    // 
  },
});

export { Loading };
