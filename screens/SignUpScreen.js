import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import todoThemeColor from '../contant'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import * as Icon from "react-native-feather";

export default function SignUpScreen({navigation}) {
  const [ email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cfmPassword, setCfmPassword] = useState('')
  const [isFocusId, setIsFocusId] = useState(null)
  const [ifLegit, setIfLegit] = useState(false)


  const checkLegitimacy = ()=>{
    if(email && password)
    {
      if(password === cfmPassword)
      {
        //validation passed
        setIfLegit(true)
      }
      else  setIfLegit(false) 
    }
    else  setIfLegit(false)  
    
  }

  
  return (
    <KeyboardAvoidingView
    keyboardVerticalOffset={10}
        behavior='padding'
    className="flex-1 "
    style={{
      backgroundColor:todoThemeColor.primaryColor
    }}
    >

         <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
        <View
        
        className="flex-col mt-20 justify-center items-center py-10 px-4">
          <Text
              className="text-3xl font-extrabold mb-10"
           >
            {
              !isFocusId && ("Register")
            }
          </Text>
          <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 60, 
                            marginTop:20,
                            height:100
                        }}
                    >

                        <Image
                    style={{ width: 300, resizeMode: 'contain' }} // Adjust width and height as needed
                    source={require('../assets/registerBg.png')}
                    />
                 </View>
                 <View style={{
                    borderColor:  isFocusId === 1 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
                }} className=" z-30 border  rounded-lg w-full p-4">
                  <TextInput
                  clearButtonMode='while-editing'
                  className="w-full"
                  value={email}
                  onChangeText={(text) => {setEmail(text)}}
                  onFocus={()=>{
                    setIsFocusId(1)
                    checkLegitimacy()
                  }}
                  onBlur={()=>{
                    setIsFocusId(null)
                  checkLegitimacy()
                  }}
                  style={{
                      fontSize:16,
                      color:todoThemeColor.fontColor
                  }} placeholder='Email' />
                </View>
                <View style={{
                  borderColor: isFocusId === 2 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
              }} className=" z-30 border mt-6 rounded-lg w-full p-4">
                <TextInput
                 value={password}
                 onChangeText={(text) => {setPassword(text)}}
                clearButtonMode='while-editing'
                className="w-full"
                secureTextEntry
                onFocus={()=>{
                  setIsFocusId(2)
                  checkLegitimacy()
                }}
                onBlur={()=>{
                  setIsFocusId(null)
                  checkLegitimacy()
                }}
                style={{
                    fontSize:16,
                    color:todoThemeColor.fontColor
                }} placeholder='New password' />
              </View>
              <View style={{
                  borderColor: isFocusId === 3 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
              }} className=" z-30 border mt-6 rounded-lg w-full p-4">
                <TextInput
                 value={cfmPassword}
                 onChangeText={(text) => {setCfmPassword(text)}}
                clearButtonMode='while-editing'
                className="w-full"
                secureTextEntry
                onFocus={()=>{
                  setIsFocusId(3)
                  checkLegitimacy()
                }}
                onBlur={()=>{
                  setIsFocusId(null)
                  checkLegitimacy()
                }}
                style={{
                    fontSize:16,
                    color:todoThemeColor.fontColor
                }} placeholder='Confirm password' />
              </View>
              {
                ifLegit && (
                  <TouchableOpacity 
                  onPress={()=>{
                    navigation.navigate('SignUpName', {
                      email,
                      password
                    })
                  }}
                  style={{
                    borderColor : todoThemeColor.primaryColor
                  }}
                  className=" z-30 border mt-6 rounded-lg p-2 self-end flex-row items-center">
                    <Text
                      className="text-lg font-bold mr-2"
                      style={{color: todoThemeColor.fontColor}}
                    >
                      Next
                    </Text>
                    <Icon.ArrowRightCircle stroke={todoThemeColor.fontColor}/>
                  </TouchableOpacity>
                )
              }
             
            <View style={{height:260}}></View>
            {
              !isFocusId&& (
                <TouchableOpacity
              onPress={()=>{
                navigation.replace("SignIn")
              }}
              className="mt-auto">
                <Text style={{color:todoThemeColor.fontColor}} className="text-md">
                    Already have a account?
                </Text>
              </TouchableOpacity>
              )
            }
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}