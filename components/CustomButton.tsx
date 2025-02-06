import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import standard from '../theme'

const CustomButton = ({ onPress, text, type }) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.textLabel, styles[`textLabel_${type}`]]}>{text}</Text>
    </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  container_primary: {
    backgroundColor: standard.colors.campusRed,
    width: '100%',
    borderRadius: 10
  },
  container_tertiary: {
    alignSelf: 'flex-end'
  },
  textLabel_primary: {
    fontFamily: standard.fonts.semiBold,
    color: standard.colors.primaryWhite,
    fontSize: 20
  },
  textLabel_tertiary: {
    fontFamily: standard.fonts.bold,
    color: standard.colors.campusRed,
    fontSize: 14,
    textAlign: 'right'
  }
})