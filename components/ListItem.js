import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Icon from 'react-native-feather'
import { useNavigation } from '@react-navigation/native'


export default function ListItem(
  {iconView, listName, taskLen, listId, itemInfo, ifTitle}
) {
  const navigation = useNavigation()
  const iconViewSize = 34
  return (
    <TouchableOpacity
    activeOpacity={ifTitle? 1 : .7}
    onPress={()=>{
     if(!ifTitle)
     {
      navigation.navigate('AddNewList', {listId,itemInfo})
     }
    }}
    className="w-full mb-1 flex-row items-center py-2 px-6">
      <View className=" justify-center items-center"
        style={{
          width:iconViewSize,
          height:iconViewSize
        }}
      >
      {iconView}
      </View>
      <Text
      className="ml-2 text-md font-bold text-white"
      >{listName}</Text>
      {taskLen !== 0 && (
        <Text
        className=" text-gray-400 ml-auto"
      >{' '}</Text>
      )
        
      }
    </TouchableOpacity>
  )
}

ListItem.defaultProps = {
  taskLen: 0,
};