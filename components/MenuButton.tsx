import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import standard from '@/theme'
import { icons } from '@/constants'


const MenuButton = ({ text, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={icons[icon]} style={styles.buttonIcon}/>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

export default MenuButton

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: 'wrap',
        alignItems: "center",
        marginTop: 17,
        borderBottomWidth: 1,
        borderColor: "#6c0318",
        paddingVertical: 8,

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