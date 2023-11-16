import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import IconOption from './IconOption'
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import todoThemeColor from '../contant'

export default SortDropDown = forwardRef(({color, handleSortBy, sortBy}, ref) => {

    const rotation = useSharedValue(0);
    const height = useSharedValue(0);
    const [ifShowDropList, setIfShowDropList] = useState(false)
    
    useImperativeHandle(ref, ()=>({
        closeDropDown: ()=>{
            if(ifShowDropList){
                startRotation()
            }
        }
    }))

    const sortMethodList = [
        {
            id:1,
            method:'regular',
            iconName:'AlignLeft',
            selectionTitle:'Sort By Default'
        },
        {
            id:2,
            method:'importance',
            iconName:'Star',
            selectionTitle:'Sort By Importance'
        },
        {
            id:3,
            method:'due',
            iconName:'Calendar',
            selectionTitle:'Sort By Due Date'
        }
    ]

    const startRotation = () => {
        const durationTime = 180;

        // Toggle dropdown list and animate its height
        if (ifShowDropList) {
            rotation.value = withTiming(0, {
                duration: durationTime, // Animation duration in milliseconds
                easing: Easing.ease,
              });
            height.value = withTiming(0, {
            duration: durationTime,
            easing: Easing.ease,
            });
        } else {
            rotation.value = withTiming(90, {
                duration: durationTime, // Animation duration in milliseconds
                easing: Easing.ease,
              });
            height.value = withTiming(150, {
            duration: durationTime,
            easing: Easing.ease,
            });
        }
        setIfShowDropList(!ifShowDropList)
      };

      const animatedStyle = useAnimatedStyle(() => {
        return {
          transform: [{ rotate: `${rotation.value}deg` }],
        };
      });

      const dropdownContainerStyle = useAnimatedStyle(() => {
        return {
          height: height.value,
          overflow: 'hidden',
        };
      });

  return (
    <>
    <TouchableOpacity
    activeOpacity={.8}
    onPress={startRotation}
    className="w-full  py-3 mb-2 px-4 flex-row justify-start items-center">
                <IconOption iconName={'RefreshCcw'} color={'white'} size={18}/>
                <View className="flex-1 ">
                <Text className="text-white mx-4">Sort</Text>
                </View>
                <Animated.View style={animatedStyle} className="">
                    <Ionicons className='ml-10' name="chevron-forward-outline" size={20} color={'white'} />
                </Animated.View>
    </TouchableOpacity>
    {/* drop down selection list goes here  */}
    
    <Animated.View style={[dropdownContainerStyle,{backgroundColor:todoThemeColor.configColor}]} className=" w-full"> 
    {
        ifShowDropList && (
            <>
                {
                    sortMethodList.map((methodItem) => (
                        <TouchableOpacity
                        onPress={()=>{handleSortBy(methodItem.method)}}
                        key={methodItem.id}
                        className="w-full  py-3 mb-2 px-4 flex-row justify-start items-center">
                            <IconOption iconName={methodItem.iconName} color={sortBy === methodItem.method ? color : 'white'} size={18}/>
                            <Text style={{color:sortBy === methodItem.method ? color : 'white'}} className=" mx-4">{methodItem.selectionTitle}</Text>
                            {
                                sortBy === methodItem.method && (
                                    <IconOption iconName={'Check'} color={color} size={18}/>
                                )
                            }
                     </TouchableOpacity>
                    ))
                }
               
            </>
        )
    }
    </Animated.View>
     
    </>
  )
})