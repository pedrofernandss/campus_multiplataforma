import { StyleSheet, Text, TouchableOpacity, Image, GestureResponderEvent } from 'react-native'
import React from 'react'
import standard from '@/theme'
import { icons } from '@/constants'

interface DrawerButtons {
  text?: string,
  icon: string,
  onPress: (event: GestureResponderEvent) => void; 
  type?: string, 
}

const CustomDrawerButton: React.FC<DrawerButtons> = ({ text, icon, onPress, type }) => {
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