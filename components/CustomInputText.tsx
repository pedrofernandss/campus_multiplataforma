import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import standard from "../theme";

const CustomInputText = ({ value, setValue, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? standard.colors.campusRed : "transparent" }, // Alterna a cor da borda
      ]}
    >
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.inputBox}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

export default CustomInputText;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1F4FF",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 48,
  },
  inputBox: {
    fontFamily: standard.fonts.semiBold,
    color: "#626262",
    flex: 1,
  },
});
