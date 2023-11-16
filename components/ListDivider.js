import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import todoThemeColor from '../contant'
import * as Icon from 'react-native-feather'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'


export default function ListDivider({color, handleToggleComplete, ifShowDivider, dividerLabel}) {

    const rotateValue = useSharedValue(0);


    const rotatedAngle = useDerivedValue(() => {
        // Set the angle to 0 degrees when the condition is false, and 90 degrees when true
        return !ifShowDivider ? withTiming(-90) : withTiming(0);
      });
    
      const rIconContainerStyle = useAnimatedStyle(() => {
         rotateValue.value = rotatedAngle.value;
        return {
          transform: [{ rotate: `${rotateValue.value}deg` }],
        };
      });

  return (
    <View  className=" flex-row mb-2">
    <TouchableOpacity 
    onPress={handleToggleComplete}
    activeOpacity={0.8}
    style={{backgroundColor:todoThemeColor.configColor}} className="flex-row items-center px-2 py-1 rounded-md">
   
    <Animated.View style={rIconContainerStyle} className=" mr-1">
    <Icon.ChevronDown width={22} height={22} color={color} className="self-center" />
    
    </Animated.View>
    <Text style={[{color:color}]} className="text-sm font-semibold">
        {dividerLabel}
    </Text>
    </TouchableOpacity>
</View>
  )
}