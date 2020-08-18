import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

//
const GradeButton = ({
  onPress,
  children,
  style,
  btnStyle,
  txtStyle,
  disabled,
}) => {
  const { button, text } = styles;
  return (
    <View style={style}>
      <TouchableOpacity
        onPress={onPress}
        style={{ ...button, ...btnStyle }}
        disabled={disabled}
      >
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
    zIndex: 0,
  },
  button: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'orange',
    backgroundColor: 'rgb(27,41,69)',
    borderRadius: 10,
    minWidth: 90,
    zIndex: -100000,
    justifyContent: 'center',
  },
});

export { GradeButton };
