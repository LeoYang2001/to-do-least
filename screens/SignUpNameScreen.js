import { View, Text, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import todoThemeColor from '../contant'
import { TextInput } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import * as Icon from 'react-native-feather'
import { useRoute } from '@react-navigation/native'
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db } from '../firebase'

export default function SignUpNameScreen({navigation}) {
  const [isFocusId, setIsFocusId] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [ifLoading, setIfLoading] = useState(false)

  const route = useRoute()
  const auth = getAuth()
  const { email, password } = route.params;
  

    

  const signUp = async () => {
    setIfLoading(true);
    const fullName = firstName + ' ' + lastName;
            
  
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store user data in the database
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        firstName: firstName,
        lastName: lastName
      }).then(
        async ()=>{
          // Update user profile
          await updateProfile(user, {
            displayName: fullName
          });
        }
      )
      
  
      
  
      console.log("User signed up and data stored successfully");
      navigation.replace('SignIn');
    } catch (error) {
      setIfLoading(false)
      const errorCode = error.code;
      alert(errorCode);
      console.error("Error:", errorCode, error.message);
    }
  };
  

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
              !isFocusId && ("Create Account")
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
                    source={require('../assets/accountCreateBg.png')}
                    />
                 </View>
                 <View style={{
                    borderColor:  isFocusId === 1 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
                }} className=" z-30 border  rounded-lg w-full p-4">
                  <TextInput
                  clearButtonMode='while-editing'
                  className="w-full"
                  value={firstName}
                  onChangeText={(text) => {setFirstName(text)}}
                  onFocus={()=>{setIsFocusId(1)}}
                  onBlur={()=>{
                    setIsFocusId(null)
                }}
                  style={{
                      fontSize:16,
                      color:todoThemeColor.fontColor
                  }} placeholder='First Name' />
                </View>
                <View style={{
                    borderColor:  isFocusId === 2 ? todoThemeColor.secondaryColor : todoThemeColor.todoThemeColor
                }} className=" z-30 border mt-6  rounded-lg w-full p-4">
                  <TextInput
                  clearButtonMode='while-editing'
                  className="w-full"
                  value={lastName}
                  onChangeText={(text) => {setLastName(text)}}
                  onFocus={()=>{setIsFocusId(2)}}
                  onBlur={()=>{
                    setIsFocusId(null)
                }}
                  style={{
                      fontSize:16,
                      color:todoThemeColor.fontColor
                  }} placeholder='Last Name' />
                </View>
               
                {
                firstName && lastName && (
                  <TouchableOpacity 
                 onPress={signUp}
                  style={{
                    borderColor : todoThemeColor.primaryColor
                  }}
                  className=" z-30 border mt-6 rounded-lg p-2 self-end flex-row items-center">
                    {
                      ifLoading ? (
                        <>
                           <Text
                      className="text-lg font-bold mr-7"
                      style={{color: todoThemeColor.fontColor}}
                    >
                      Creating
                    </Text>
                    <View
                      className="absolute z-50 right-2"
                    >
                      <ActivityIndicator  size="small" color={todoThemeColor.secondaryColor}/>
                    </View>
                        </>
                      ) : (
                        <>
                          <Text
                      className="text-lg font-bold mr-2"
                      style={{color: todoThemeColor.fontColor}}
                    >
                      Create
                    </Text>
                    <Icon.ArrowRightCircle stroke={todoThemeColor.fontColor}/>
                        </>
                      )
                    }
                    
                   
                  </TouchableOpacity>
                )
                }
             
            <View style={{height:260}}></View>
            
        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}