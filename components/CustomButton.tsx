import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import standard from "../theme";

const CustomButton = ({ onPress, text, type }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        styles[`container_${type}`],
        pressed && styles.container_pressed,
      ]}
    >
      <Text style={[styles.textLabel, styles[`textLabel_${type}`]]}>
        {text}
      </Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  container_primary: {
    backgroundColor: standard.colors.campusRed,
    width: "100%",
    borderRadius: 10,
  },
  container_tertiary: {
    alignSelf: "flex-end",
  },
  container_pressed: {
    backgroundColor: "#a85d6c"
  },
  textLabel_primary: {
    fontFamily: standard.fonts.semiBold,
    color: standard.colors.primaryWhite,
    fontSize: 20,
  },
  textLabel_tertiary: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.campusRed,
    fontSize: 14,
    textAlign: "right",
  },
});
