import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDown = ({
  items,
  value,
  placeholder,
  onChange,
  onOpen,
  disabled,
  zIndex,
  containerPropStyle,
  inputPropStyle,
  dropDownPropStyle,
  labelPropStyle,
}) => {
  const {
    containerStyle,
    inputStyle,
    dropDownStyle,
    labelStyle,
    basicStyle,
  } = styles;

  return (
    <DropDownPicker
      items={items}
      style={basicStyle}
      defaultValue={value}
      placeholder={placeholder}
      containerStyle={{ ...containerStyle, ...containerPropStyle }}
      style={basicStyle}
      dropDownStyle={{ ...dropDownStyle, ...dropDownPropStyle }}
      itemStyle={{
        justifyContent: 'flex-start',
      }}
      labelStyle={{ ...labelStyle, ...labelPropStyle }}
      onChangeItem={onChange}
      onOpen={onOpen}
      onClose={onOpen}
      disabled={disabled}
      zIndex={zIndex}
    />
  );
};

const styles = new StyleSheet.create({
  containerStyle: {
    height: 55,
  },
  basicStyle: {
    backgroundColor: 'rgba(255,255,255, 0.85)',
    borderColor: 'rgba(27,41,69, 0.9)',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  inputStyle: {
    backgroundColor: 'rgba(255,255,255, 0.85)',
    borderWidth: 0,
  },
  dropDownStyle: {
    backgroundColor: 'rgb(255,255,255)',
    width: '100%',
    minHeight: 60,
    maxHeight: 175,
    borderColor: 'rgb(27,41,69)',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  labelStyle: {
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
  },
});

export { DropDown };
