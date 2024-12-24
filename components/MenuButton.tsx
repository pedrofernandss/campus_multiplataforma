import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const MenuButton = ({ text, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <FontAwesome name={icon} size={20} style={styles.buttonIcon} />
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
        padding: 10,
      },
      buttonIcon: {
        marginRight: 8,
        color: "#7777",
      },
      buttonText: {
        marginLeft: 10,
        marginTop: 10, 
        fontSize: 16,
        color: "#7777",
        fontWeight: "700",
      },
})