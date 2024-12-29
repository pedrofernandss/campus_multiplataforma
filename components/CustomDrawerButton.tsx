import { StyleSheet, Text, TouchableOpacity, Image, GestureResponderEvent } from 'react-native'
import React from 'react'
import standard from '@/theme'
import { icons, types } from '@/constants'


const CustomDrawerButton: React.FC<types.DrawerButtons> = ({ text, icon, onPress, type }) => {
  return (
    <TouchableOpacity style={[styles.container, styles[`innerContainer_${type}` as keyof typeof styles]]} onPress={onPress}>
      <Image source={icons[icon as keyof typeof icons]} style={styles.buttonIcon}/>
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
  innerContainer_active: {
    borderBottomWidth: 1,
    borderColor: standard.colors.campusRed,
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