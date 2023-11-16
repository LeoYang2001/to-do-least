import { View, Text, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from "firebase/auth";
import ListItem from '../components/ListItem';
import * as Icon from 'react-native-feather'
import todoThemeColor, { colorList, iconList } from '../contant'
import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import IconOption from '../components/IconOption';
import { useFocusEffect } from '@react-navigation/native';





export default function HomeScreen({navigation}) {

  
  const auth = getAuth();
  const user = auth.currentUser;
  const fullName = user.displayName.split(' ')
  const initials = fullName[0].slice(0,1) + fullName[1].slice(0,1)
  const iconSize = 22;
  const [ifLoading, setIfLoading] = useState(true)

  const signOutUser = ()=>{
    navigation.replace('SignIn')
    // auth.signOut().then(()=>{
    // })
  }

  const fetchListsByUserId = async (userId) => {
    try {
      const listsRef = collection(db, 'lists');
      const q = query(listsRef, where('userId', '==', userId), orderBy('createdTime','asc'));
      const querySnapshot = await getDocs(q);
  
      const lists = [];
      querySnapshot.forEach((doc) => {
        // Access the data of each document
        const data = doc.data();
        lists.push({ listId: doc.id, ...data });
      });
  
      // 'lists' now contains the lists associated with the specified userId
      return lists;
    } catch (e) {
      console.error('Error fetching lists by userId: ', e);
    }
};

  useFocusEffect(() => {
  (async () => {
    try {
      const lists = await fetchListsByUserId(user.uid);
      const formatted_lists = lists.map((item)=>{
        const id = item.listId
        const iconView = ( <IconOption iconName={iconList[item.iconId - 1].iconName} color={colorList[item.colorId - 1]} size={iconSize} />)
        const listName = item.listName
        const taskLen = 2
        const itemInfo = {
          listName: item.listName,
          colorId: item.colorId,
          iconId: item.iconId,
          ifDisplayDue: item.ifDisplayDue,
          sortBy: item.sortBy
        }
        return ({
          id,
          iconView,
          listName,
          taskLen,
          itemInfo
        })
      })
      setLists(formatted_lists)
      setIfLoading(false)
      
    } catch (error) {
      console.error('Error:', error);
    }
  })()
  
  
    
  })
  

  const init_lists = [
    
  ]

  const [lists, setLists] = useState(init_lists)
  
  return (
    <SafeAreaView 
    style={{
      backgroundColor:"#000"
    }}
    className=" flex-1 relative">
      <StatusBar barStyle={'light-content'} />
       {/* header goes here */}
       
       <ListItem 
       ifTitle={true}
      iconView={
          <TouchableOpacity 
            onPress={signOutUser}
            style={{
              width:30,
              height:30,
              backgroundColor:todoThemeColor.primaryColor
            }}
            className=" rounded-full justify-center"
            >
            <Text
              className="text-black self-center"
              >{initials}</Text>
        </TouchableOpacity>
      }
      listName={user.displayName || " "}
      />
   <View
     className="flex-1 flex-col  justify-center items-center">
      {
        ifLoading && (
    <ActivityIndicator style={{top:Dimensions.get('window').height * .35}} className="absolute self-center"  size="large" color={todoThemeColor.primaryColor}/>
        )
      }
      {/* Lists go here */}
      
     {
      lists ? (
          lists.length > 0 && (
            <ScrollView
            className="flex-1 flex-col ">
              {
                lists.map((list) => (
                  <ListItem
                    key={list.id}
                    iconView={list.iconView}
                    listName={list.listName}
                    taskLen={list.taskLen}
                    listId = {list.id}
                    itemInfo = {list.itemInfo}
                  />
                ))
              }
            </ScrollView>
          )
      ):(
        <Text className="text-white text-2xl">
          Internal Error!
        </Text>
      )
     }

      {
        lists.length === 0 && !ifLoading &&  (
          <>
          <Image className="mb-6" source={require('../assets/empty.png')} />
          <Text className=" text-gray-300 text-2xl font-bold">Empty list!</Text>
          <Text className="text-gray-400  text-sm font-light mt-2">
            Add some new lists to start your journey
          </Text>
          </>
        )
      }
      </View>
      
      
    {/* Add New List goes here */}
   
    <TouchableOpacity
        onPress={()=>{
          navigation.navigate('AddNewList')
        }}
        activeOpacity={.7}
        style={{
        }}
        className="w-full flex-row bottom-2 items-center py-2 px-6">
          <View className=" justify-center items-center"
            style={{
              width:34,
              height:34
            }}
      >
      <Icon.Plus
       width={iconSize}
       height={iconSize}
       color={'#D1D5DB'}
      />
      </View>
      <Text
      className="ml-2 text-md font-bold text-gray-300"
      >New List</Text>
      
    </TouchableOpacity>
    </SafeAreaView>
  )
}