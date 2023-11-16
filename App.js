import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getAuth } from "firebase/auth";
import {  auth } from './firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignUpNameScreen from './screens/SignUpNameScreen';
import AddNewListScreen from './screens/AddNewListScreen';
import TestingScreen from './screens/TestingScreen';

export default function App() {

  

  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown:false
      }} initialRouteName='SignIn'>
        <Stack.Screen name='SignIn' component={SignInScreen}/>
        <Stack.Screen name='SignUp' component={SignUpScreen}/>
        <Stack.Screen name='SignUpName' component={SignUpNameScreen}/>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen 
         options={{ headerShown: true }} 
        name='AddNewList' component={AddNewListScreen}/>
        <Stack.Screen
          name="Testing" component={TestingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

