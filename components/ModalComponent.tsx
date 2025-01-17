import { StyleSheet, Text, View, Modal, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { ModalBox } from '@/types/modal'
import standard from '@/theme'
import { icons } from '@/constants'

const ModalComponent: React.FC<ModalBox> = ( { title, label, icon, isOpen, hasInput, onConfirmButton, 
    onCancelButton, confirmButtonText, cancelButtonText, inputValue, onInputChange } ) => {
  return (
    <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        statusBarTranslucent  
    >
      <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <Image source={icons[icon as keyof typeof icons]} style={styles.iconContainer}/>
                {title && <Text style={styles.title}>{title}</Text>}
                <Text style={styles.label}>{label}</Text>
                {hasInput && (
                  <TextInput style={styles.input} 
                  placeholder="Digite aqui..."
                  textAlignVertical="top"
                  multiline={true}
                  value={inputValue}
                  onChangeText={onInputChange} />
                )
                  }
                <View style={styles.buttonContainer}>
                    {onCancelButton && (
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancelButton}>
                        <Text style={styles.cancelButtonText}>{cancelButtonText || 'Cancelar'}</Text>
                        </TouchableOpacity>
                    )}
                    {onConfirmButton && (
                    <TouchableOpacity style={styles.button} onPress={onConfirmButton}>
                    <Text style={styles.buttonText}>{confirmButtonText || 'Confirmar'}</Text>
                    </TouchableOpacity>
                    )}
                </View>
            </View>
      </View>
    </Modal>
  )
}

export default ModalComponent

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContainer: {
        width: '95%',
        backgroundColor: '#ECECEC',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      title: {
        fontSize: 18,
        fontFamily: standard.fonts.bold,
        marginBottom: 10,
      },
      iconContainer: {
        width: 32,
        height: 32,
        marginVertical: 10,
      },
      label: {
        fontSize: 15,
        lineHeight: 18,
        textAlign: 'center',
        marginVertical: 10,
        color: '#7E7E7E',
        fontFamily: standard.fonts.regular
      },
      input: {
        width: '100%',
        height: 104,
        backgroundColor: standard.colors.primaryWhite,
  
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        
      },
      buttonContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'flex-end'
      },
      button: {
        backgroundColor: standard.colors.campusRed,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 6,
      },
      cancelButton: {
        backgroundColor: '#DEDAD5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
      },
      buttonText: {
        color: standard.colors.primaryWhite,
        fontSize: 16,
        fontFamily: standard.fonts.bold,
      },
      cancelButtonText: {
        color: '#423B34',
        fontSize: 16,
        fontFamily: standard.fonts.bold,
      },
})