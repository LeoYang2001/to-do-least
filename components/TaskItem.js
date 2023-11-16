import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import todoThemeColor, { importanceLevelList } from '../contant'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import * as Icon from 'react-native-feather'
import Ionicons from '@expo/vector-icons/Ionicons';
import { calculateTimeDifference, calculateTimeRemaining, convertDateFormat, hexColorWithOpacity } from '../util'


export default function TaskItem({ifDisplayDue,deadLine,simultaneousHandlers,task,color, handleDeleteTask, handleCompleteTask, taskId, ifDone, iconView}) {

    const LIST_ITEM_HEIGHT = 76;

    const translateX = useSharedValue(0)
    const itemHeight = useSharedValue(LIST_ITEM_HEIGHT)
    const marginBottom = useSharedValue(6)
    const iconOpacity = useSharedValue(1)

    const { width : SCREEN_WIDTH } = Dimensions.get('window')
    const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * .2

    
    
    // this is basically a mandatory process
    const panGesture = useAnimatedGestureHandler({
        onActive: (event)=> {
            translateX.value = event.translationX
        },
        onEnd: ()=> {
            const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD 
            const shouldBeComplete = translateX.value > (TRANSLATE_X_THRESHOLD) * (-1) 
            if(shouldBeDismissed)
            {
                translateX.value = withTiming(-SCREEN_WIDTH)
                itemHeight.value = withTiming(0)
                marginBottom.value = withTiming(0)
                iconOpacity.value = withTiming(0, undefined, (isFinished)=>{
                    if(isFinished){
                        runOnJS(handleDeleteTask)(taskId)
                    }
                })
            }
            else if(shouldBeComplete){
                translateX.value = withTiming(0)

                translateX.value = withTiming(SCREEN_WIDTH)
                itemHeight.value = withTiming(0)
                marginBottom.value = withTiming(0)
                iconOpacity.value = withTiming(0, undefined, (isFinished)=>{
                    if(isFinished){
                        runOnJS(handleCompleteTask)(taskId)
                    }
                })
            }
            else{
                translateX.value = withTiming(0)
            }
        }
    })

    const rStyle = useAnimatedStyle(()=>({
        transform: [{
            translateX: translateX.value
        }]
    }))

    const rIconContainerStyle = useAnimatedStyle(()=>{
        const opacity = withTiming(
            translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
        );
        return {opacity}
    })

    const lIconContainerStyle = useAnimatedStyle(()=>{
        const opacity = withTiming(
            translateX.value  > (TRANSLATE_X_THRESHOLD) * (-1) ? 1 : 0
        );
        return {opacity}
    })

    const rTaskContainerStyle = useAnimatedStyle(()=>{
        return {
            height: itemHeight.value,
            marginBottom: marginBottom.value,
            opacity:iconOpacity.value
        }
    })

  return (
    <Animated.View 
                style={[{
                    height:LIST_ITEM_HEIGHT
                },rTaskContainerStyle]}
                className="w-full relative  rounded-lg"
                 >
                <Animated.View style={rIconContainerStyle} className="absolute right-2 z-0 h-full items-center justify-center">
                    <Ionicons name="close-circle-outline" size={32} color={'#ff0000'} />
                </Animated.View>
                <Animated.View style={lIconContainerStyle}  className="absolute left-2 z-0 h-full items-center justify-center">
                    {
                        ifDone ? (
                            <Ionicons name="arrow-undo-circle-outline" size={32} color={'#4dff4d'} />
                        ):(
                            <Ionicons name="checkmark-circle-outline" size={32} color={'#4dff4d'} />
                        )
                    }
                </Animated.View>
        <PanGestureHandler
            simultaneousHandlers={simultaneousHandlers}
            onGestureEvent={panGesture}
        >
            
            <Animated.View
            style={[{backgroundColor:'#333333'}, rStyle]}
            className="w-full rounded-lg flex-row h-full
             justify-start items-between px-4"
            >
                <View style={{backgroundColor:calculateTimeDifference(deadLine) === -1 ? todoThemeColor.alertColor : color,width:6}} className="absolute h-full rounded-l-lg">
                </View>
                <View 
                style={{
                    justifyContent: ifDisplayDue ? 'space-between' : 'center',
                }}
                className="h-full flex-col   w-full py-2">
                    {
                        ifDisplayDue ? (
                            <Text
                     numberOfLines={2} 
                        style={{color:ifDone ? '#ccc' : 'white', textDecorationLine:ifDone ? 'line-through': 'none'}}
                        className="text-md font-semibold ml-0 "
                    >
                        {task}
                    </Text>
                        ) : (
                            <Text
                     numberOfLines={2} 
                        style={{
                            fontStyle:"italic",
                            color:ifDone ? '#ccc' : 'white', textDecorationLine:ifDone ? 'line-through': 'none'}}
                        className="text-lg font-semibold ml-0  self-center"
                    >
                        {task}
                    </Text>
                        )
                    }
                    {/* due date  */}
                 {
                    ifDisplayDue && (
                        <>
                        
                        <View
                       className="flex-row justify-start items-center"
                    >
                        {
                            (!ifDone && deadLine) && (
                                <>
                                <Ionicons name="hourglass-outline" size={18} color={calculateTimeDifference(deadLine) === -1 ? todoThemeColor.alertColor : '#9CA3AF'} />
                                <Text
                                style={{color:calculateTimeDifference(deadLine) === -1 ? todoThemeColor.alertColor : '#9CA3AF'}}
                                className=" ml-1 text-sm font-semilight"
                                >{
                                    calculateTimeDifference(deadLine) === -1 ? (
                                        'Deadline has passed!'
                                    ):(
                                        calculateTimeDifference(deadLine)
                                    )
                                }</Text>
                                </>
                            )
                        }
                        {
                            (!ifDone && !deadLine) && (
                                <Text
                                style={{color:color}}
                                className=" ml-0 text-sm font-semilight"
                                >
                                    No Due Date
                                </Text>
                            )
                        }
                        {
                            (ifDone) && (
                                <Text
                                style={{color:color}}
                                className=" ml-0 text-sm font-semilight"
                                >
                                    Done!
                                </Text>
                            )
                        }
                    </View>
                        </>
                    )
                 }
                   
                </View>
                <View
                    style={{
                        color:ifDone ? '#ccc' : 'white',
                        textDecorationLine:ifDone ? 'line-through': 'none',
                        width:30,
                        height:30,
                        backgroundColor:iconView ? hexColorWithOpacity(color,30) : 'transparent'
                    }}
                    className={ifDisplayDue ?
                         ("text-md ml-auto mt-auto mb-2 justify-center items-center rounded-full")
                    :
                        ("text-md ml-auto self-center justify-center items-center rounded-full")
                }
                >
                    {
                        iconView
                    }
                </View>
            </Animated.View>
        </PanGestureHandler>
               
    </Animated.View>
  )
}