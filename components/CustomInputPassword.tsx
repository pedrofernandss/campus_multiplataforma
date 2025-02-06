import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import standard from '../theme';

const CustomInput = ({ value, setValue, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? standard.colors.campusRed : 'transparent' } // Alterna a cor da borda
      ]}
    >
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={!showPassword}
        style={styles.inputBox}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {String(value ?? '').length > 0 && (
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      )}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F4FF',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 48,
  },
  inputBox: {
    fontFamily: standard.fonts.semiBold,
    color: '#626262',
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
});
