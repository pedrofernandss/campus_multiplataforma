import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import standard from '@/theme'
import { icons } from '@/constants'


const CustomDrawerButton = ({ text, icon, onPress, type}) => {
  return (
    <TouchableOpacity style={[styles.container, styles[`container_${type}`]]} onPress={onPress}>
      <Image source={icons[icon]} style={styles.buttonIcon}/>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default CustomDrawerButton

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    marginTop: 17,
    paddingVertical: 8,
  },
  container_primary: {
    borderBottomWidth: 1,
    borderColor: "#6c0318",
  },
  buttonIcon: {
    width: 32,
    height: 32,
    color: standard.colors.grey,
  },
  buttonText: {
    marginLeft: 10,
    marginTop: 10, 
    fontSize: 16,
    color: standard.colors.grey,
    fontFamily: standard.fonts.bold
  },
})