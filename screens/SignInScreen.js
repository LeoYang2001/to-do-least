import { View, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import todoThemeColor from '../contant'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { CommonActions } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignInScreen({navigation}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFocusId, setIsFocusId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const auth = getAuth();

  const signIn = ()=>{
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setIsLoading(false)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }], // Replace 'NewStackScreen' with the name of the stack you want to navigate to
        })
      );
      // ...
    })
    .catch((error) => {
      setIsLoading(false)
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)

    });
  }
  return (
    <KeyboardAvoidingView
        
    className="flex-1 "
    style={{
      backgroundColor:todoThemeColor.primaryColor
    }}
    >
         <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
        <View
        
        className="flex-col mt-2 justify-center items-center py-10 px-4">
          <Text style={{color:todoThemeColor.fontColor}} className="mt-6 text-3xl font-extrabold self-center">
            {
              !isFocusId && ('Welcome to')
            }
          </Text>
          <Text style={{color:todoThemeColor.fontColor}} className=" text-3xl font-extrabold self-center">
                {
                  !isFocusId && (
                    <>
                      <Text style={{color:todoThemeColor.secondaryColor}}>Lee</Text> Day
                    </>
                  )
                }
          </Text>
          <View>
          <Image 
          className = " self-center"
          width={300} height={300} source={{
              uri:"https://cdn.dribbble.com/users/25980/screenshots/5623480/media/622dea70779b8e013904be4b91bc2b78.gif"
          }}/>
        </View>
                 <View style={{
                  marginTop:-30,
                    borderColor:  isFocusId === 1 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
                }} className="z-30 border  rounded-lg w-full p-4">
                  <TextInput
                  value={email}
                  onChangeText={text => setEmail(text)}
                  clearButtonMode='while-editing'
                  textContentType='emailAddress'
                  className="w-full"
                  onFocus={()=>{setIsFocusId(1)}}
                  onBlur={()=>{setIsFocusId(null)}}
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
                 onChangeText={psw => setPassword(psw)}
                clearButtonMode='while-editing'
                className="w-full"
                secureTextEntry
                onFocus={()=>{setIsFocusId(2)}}
                onBlur={()=>{setIsFocusId(null)}}
                style={{
                    fontSize:16,
                    color:todoThemeColor.fontColor
                }} placeholder='Password' />
              </View>
              {
                email && password && (
                  <TouchableOpacity
                  onPress={signIn}
                  style={{
                    backgroundColor : 'transparent'
                  }} className=" z-30 items-center justify-center flex-row mt-6 rounded-2xl w-full p-2">
                    
                    {
                    isLoading ? (
                      <>
                         <Text
                      className="text-2xl font-bold"
                      style={{color: todoThemeColor.secondaryColor}}
                    >Logging
                    </Text>
                      <ActivityIndicator className="ml-1" size="small" color={todoThemeColor.secondaryColor} />
                    
                      </>
                      ):(
                        <Text
                        className="text-2xl font-bold"
                        style={{color: todoThemeColor.secondaryColor}}
                      >Login
                      </Text>
                      )
                  }
                  </TouchableOpacity>
                )
              }
             
            <View style={{height:275}}></View>
            {
              !isFocusId&& (
                <TouchableOpacity
              onPress={()=>{
                navigation.replace("SignUp")
              }}
              className="mt-auto">
                <Text style={{color:todoThemeColor.fontColor}} className="text-md">
                    Don't have a account?
                </Text>
              </TouchableOpacity>
              )
            }
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}