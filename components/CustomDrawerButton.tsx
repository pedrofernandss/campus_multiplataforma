import { StyleSheet, Text, TouchableOpacity, Image, GestureResponderEvent } from 'react-native'
import React, { useState } from 'react'
import standard from '@/theme'
import { icons, types } from '@/constants'
import { opacity } from 'react-native-reanimated/lib/typescript/Colors'


const CustomDrawerButton: React.FC<types.DrawerButtons> = ({ text, icon, onPress, type }) => {
  const [isPressed, setIsPressed] = useState(false);


  return (
    <TouchableOpacity 
    style={styles.container}
    onPressIn={() => setIsPressed(true)} // Quando pressionado
    onPressOut={() => setIsPressed(false)} // Quando liberado
    onPress={onPress} // Ação principal ao clicar
    >
      <Image
        source={icons[icon as keyof typeof icons]}
        style={[
          styles.buttonIcon,
          { tintColor: isPressed ? standard.colors.campusRed : standard.colors.grey}, // Altera a cor do ícone
        ]}
      />
      <Text style={[styles.buttonText, isPressed && styles.pressedText]}>{text}</Text>
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
    paddingVertical: 2,
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
    marginTop: 7, 
    fontSize: 16,
    color: standard.colors.grey,
    fontFamily: standard.fonts.bold
  },
  pressedText: {
    color: standard.colors.campusRed, // Cor ao pressionar
  },
})