import { View, Text, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Image, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useCallback, useMemo, useRef  } from 'react'
import { Animated } from "react-native";
import * as Icon from 'react-native-feather'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from 'react-native-gesture-handler';
import { convertDateFormat, hexColorWithOpacity, lightOrDark } from '../util';
import { colorList, iconList, init_tasks, importanceLevelList, underDevelopAlert} from '../contant';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import IconOption from '../components/IconOption';
import { useRoute } from '@react-navigation/native';
import TaskList from '../components/TaskList';
import BottomSheet from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import todoThemeColor from '../contant'
import { Dimensions } from 'react-native';
import {  Platform } from 'react-native';
import DatePicker , { getFormatedDate } from 'react-native-modern-datepicker'
import SortDropDown from '../components/SortDropDown';
import { Alert } from 'react-native';





export default function AddNewListScreen({navigation}) {
    
    // just for removing the warning
    const av = new Animated.Value(0);
    av.addListener(() => {return});

    const auth = getAuth();
    const user = auth.currentUser;
    const route = useRoute()
    const baseHeight = Dimensions.get('window').height / 100;

    //values for bottomSheet
      // ref
    const bottomSheetRef = useRef(null);
    const sortDropDownComRef = useRef()

    const snapPoints = useMemo(() => ['50%'], []);
    
    // if bottomSheet is displaying
    const [ifBottomSheet, setIfBottomSheet] = useState(false)
    const [ifDeleting, setIfDeleting] = useState(false)
    

    // callbacks
    const handleSheetChanges = useCallback((index) => {
        if(index !== 0)
        {
            setIfBottomSheet(false)
        }
    }, []);

    const handleOpenPress = () => {
        bottomSheetRef.current?.expand();
        setIfBottomSheet(true)
    };

    const handleClosePress = () => {
        bottomSheetRef.current?.close();
        setIfBottomSheet(false)
        if (sortDropDownComRef) {
            sortDropDownComRef.current.closeDropDown()
          }
      };

    const handleDeleteList = async () => {
        setIfDeleting(true)
        try {
            const listRef = doc(db, 'lists', listId);
            await deleteDoc(listRef);
            console.log('List deleted successfully');
            setIfDeleting(false)
            navigation.goBack()
          } catch (error) {
            console.error('Error deleting list:', error);
          }
    }

    const handleRename = async ()=>{
        try{
            setFileStatus('unsaved')
            handleClosePress()
            setTimeout(() => {
                if (textInputRef.current) {
                    textInputRef.current.focus();
                }
              }, 0);        
        }
        catch{

        }
    }

    const resetTaskConfig = ()=>{
        setImportanceLevel(1)
        setSelectedDate(null)
        setifAddingTask(false)
    }

    const handleSortBy = (sortMethod)=>{
        setSortBy(sortMethod)
    }

    const handleAddTask = async () => {
        
        if(newTask.trim() === '')   return;
        try {
            resetTaskConfig()
            setIfAppendingTask(true)
            switch(importanceLevel){
                case 1:setIfAppendingCategorizedTask('casual')
                break;
                case 2:setIfAppendingCategorizedTask('moderate')
                break;
                case 3:setIfAppendingCategorizedTask('critical')
                break;
                default:
                    setIfAppendingCategorizedTask('')
            }
            const ifDone = false;
            let newTaskItem = {
                task: newTask,
                importanceLevel:importanceLevel,
                deadLine: selectedDate ? selectedDate : null,
                ifDone,
            };
          const taskRef = collection(db, 'lists', listId, 'tasks');
      
          // Add a new task to the subcollection 'tasks' and let Firebase generate an ID
          const docRef = await addDoc(taskRef, newTaskItem);
          console.log('New task added with ID: ', docRef.id);
          newTaskItem.taskId = docRef.id
          setIfAppendingTask(false)
          setIfAppendingCategorizedTask('')
            setTasks([...tasks, newTaskItem]);

          setNewTask('');
        } catch (error) {
          console.error('Error adding task:', error);
        }
      };
      
      const deleteTaskById = async function(taskId){
        try {
            
            if (listId) {
              const taskRef = doc(db, 'lists', listId, 'tasks', taskId);
        
              // Delete the task from the subcollection 'tasks'
              await deleteDoc(taskRef);
              console.log('Task deleted with ID: ', taskId);
        
              // Continue with any other logic after deletion
            } else {
              console.error('listId is null or undefined. Cannot delete task.');
            }
          } catch (error) {
            console.error('Error deleting task:', error);
          }
      }

      const completeTaskById = async function (taskId) {
        try {
          if (listId) {
            const taskRef = doc(db, 'lists', listId, 'tasks', taskId);
      
            // Get the current task data
            const taskDoc = await getDoc(taskRef);
            const taskData = taskDoc.data();
      
            // Toggle the 'ifDone' field
            const updatedIfDone = !taskData.ifDone;
      
            // Update the task with the new 'ifDone' value
            await updateDoc(taskRef, {
              ifDone: updatedIfDone,
            });
      
            console.log('Task marked as completed:', taskId);
          } else {
            console.error('listId is null or undefined. Cannot complete task.');
          }
        } catch (error) {
          console.error('Error completing task:', error);
        }
      };
    
      const handleDeleteTask = useCallback(async (taskId) => {
        deleteTaskById(taskId).then(()=>{
        })
      });

    const handleCompleteTask = useCallback(async (taskId)=>{
        const updatedTasks = tasks.map((task)=>{
            if(task.taskId === taskId)
            {
                return {
                    ...task,
                    ifDone: !task.ifDone
                }
            }
            else return task
        })
        setTasks(updatedTasks)
        completeTaskById(taskId).then(()=>{
    })
    })

    


  const createNewList = async (userId, listName, iconId, colorId) => {
    try {
        if (listId) {
          // Update an existing list
          const listRef = doc(db, 'lists', listId);
          
          await updateDoc(listRef, {
            listName,
            iconId,
            colorId,
            updatedTime: serverTimestamp(),
            sortBy,
            ifDisplayDue
          });
          console.log('List updated with ID: ', listId);
        } else {
          // Create a new list
          const docRef = await addDoc(collection(db, 'lists'), {
            userId: userId,
            listName: listName,
            iconId: iconId,
            colorId: colorId,
            createdTime: serverTimestamp(),
            sortBy,
            ifDisplayDue
          });
          const newId = docRef.id;
            await updateDoc(docRef, {
                listId: newId,
            });
          console.log('New List created with ID: ', docRef.id);
          setListId(docRef.id);
        }
      } catch (e) {
        console.error('Error creating/updating a list: ', e);
      }  
  }

  const fetchTasksByListId = async (listId) => {
    try {
      const tasksRef = collection(db, 'lists', listId, 'tasks');
      const querySnapshot = await getDocs(tasksRef);
  
      const tasks = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({ taskId: doc.id, ...data });
      });
  
      if (tasks.length > 0) {
        setTasks(tasks)
      } else {
        console.log('No tasks found for listId: ', listId);
      }
    } catch (e) {
      console.error('Error fetching tasks by listId: ', e);
    }
  };

    const textInputRef = useRef(null);
    // a status differs the file from a new list and an existing list 
    const [ifNewFile, setIfNewFile] = useState(true)
   
    const [listName, setListName] = useState('Untitled list')
    const [listId, setListId] = useState(null)
    const [configId, setConfigId] = useState(1)
    const [colorId, setColorId] = useState(1)
    const [color, setColor] = useState(colorList[colorId - 1])
    const [iconId, setIconId] = useState(1)
    //three status: unsaved saving saved
    const [fileStatus, setFileStatus] = useState('unsaved')
    const [ifAddingTask, setifAddingTask] = useState(false)
    const [ifAppendingTask, setIfAppendingTask] = useState(false)
    const [ifAppendingCategorizedTask, setIfAppendingCategorizedTask] = useState('')

    //fetch tasks by listId
    const [tasks, setTasks] = useState(init_tasks)
    const [newTask, setNewTask] = useState('')

    //configurations for taskItem
    const [modalVisible, setModalVisible] = useState(false)
    const [dateModalVisible, setDateModalVisible] = useState(false)
    const [importanceLevel, setImportanceLevel] = useState(1)
    const [selectedDate, setSelectedDate] = useState(null);
    // there are 3 sort method : regular, importance, due
    const [sortBy, setSortBy] = useState('regular')
    // toggle if display the due date for each task 
    const [ifDisplayDue, setIfDisplayDue] = useState(true)
    
    const selectionSize = 36;


    const updateListConfigs = async ()=>{
        try {
            if (listId) {
              // Update an existing list
              const listRef = doc(db, 'lists', listId);
              
              await updateDoc(listRef, {
                updatedTime: serverTimestamp(),
                sortBy,
                ifDisplayDue
              });
              console.log('List updated with ID: ', listId);
            } else {
              console.log('List updating failed with ID: ', docRef.id);
            }
          } catch (e) {
            console.error('Error updating a list: ', e);
          }  
    }

  
    // Use the useEffect hook to update the color when colorId changes
    useEffect(() => {
        
        setColor(colorList[colorId - 1]);
        // initialize configs when listId is null
        if(route.params && !listId)
        {
            try {
                const itemInfo = route.params.itemInfo
            
                setListName(itemInfo.listName)
                setColorId(itemInfo.colorId)
                setIconId(itemInfo.iconId)
                setIfNewFile(false)
                setFileStatus('saved')
                setIfNewFile(true)
                setIfDisplayDue(itemInfo.ifDisplayDue)
                setSortBy(itemInfo.sortBy)
                //set list id
                setListId(route.params.listId)
            } catch (error) {
                console.log(error);
                
            }
        }
        else{
            setIfNewFile(true)
        }
    }, [colorId,listId]);


    useEffect(() => {
        if (listId) {
            updateListConfigs()
            fetchTasksByListId(listId);
        }
    }, [listId, sortBy, ifDisplayDue]);

    const handleSaveList = async ()=>{
        setFileStatus('saving')
        await createNewList(user.uid, listName, iconId, colorId)
        setFileStatus('saved')
    }


    useLayoutEffect(()=>{
    navigation.setOptions({
      title:'',
      headerStyle:{
        backgroundColor: '#000',
      shadowOpacity: 0, // Hide the bottom line
      elevation: 0, // For Android
      borderBottomWidth: 0
      },
      headerTitleStyle:{color:"#000"},
      headerTintColor:'#000',
      headerLeft:()=>(
        <TouchableOpacity
            className="flex-row justify-center items-center"
          onPress={()=>{
                navigation.goBack()
          }}
        >
            <Ionicons name="chevron-back-outline" size={32} color={color} />
            <Text
                className="text-md"
                style={{color:color}}
            >Lists</Text>
        </TouchableOpacity>
      ),
      headerRight:()=> (
        <>
            {
                fileStatus === 'unsaved' && (
                    <TouchableOpacity
                    onPress={handleSaveList}
                    className="mr-2 flex-row justify-center items-center"
                    >
                         <Text
                        style={{color:color}}
                        className="text-md"
                        >Save</Text>
                    </TouchableOpacity>
                )
            }
            {
                fileStatus === 'saving' && (
                    <View
                    className="mr-2 flex-row justify-center items-center"
                    >
                      <Text
                        style={{color:color}}
                        className="text-md mr-2"
                        >Saving</Text>
                      <ActivityIndicator  size="small" color={color}/>

                    </View>
                )
            }
            {
                fileStatus === 'saved' && listId && (
                    <TouchableOpacity
                    onPress={()=>{
                        handleOpenPress()
                        setifAddingTask(false)
                    }}
                    className="mr-2 flex-row justify-center items-center"
                    >
                    <Icon.MoreHorizontal
                    width={32}
                    height={32}
                    color={color} />
                    </TouchableOpacity>
                )
            }
        </>
      )
    })
  })
  return (
    <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
        keyboardVerticalOffset={90}
        behavior='padding'
        style={{
            backgroundColor:"#000"
        }}
        className="flex-1 pt-4"
    >
        
        <View className='flex-1 px-4 '>
            {/* display a loading spinning  */}
            {
                !ifNewFile && (
                    <View className=" items-center flex-row">
                    <ActivityIndicator className="self-start self-center" size="small" color={color}/>
                    <Text className='text-3xl'> </Text>
                    </View>
                )
            }
            {
                
            }
            {/* List Title goes here  */}
            {
                ifNewFile && (
                    <View className="relative flex-row w-full">
                        <IconOption size={30} className="absolute left-2" iconName={iconList[iconId - 1].iconName} color={color} />
                        <TextInput
                        onSubmitEditing={handleSaveList}
                        ref={textInputRef}
                        style={{color:color}}
                        value={listName}
                        maxLength={15}
                        onChangeText={(text)=> setListName(text)}
                        editable = {fileStatus !== 'saved'}
                        autoFocus
                        className="ml-2 text-3xl font-bold w-full"
                    />
                    </View>
                )
            }
            {/* tasks List goes here  */}
            <View className=" flex-1 ">
                <TaskList ifDisplayDue={ifDisplayDue} sortBy={sortBy} ifAppendingCategorizedTask={ifAppendingCategorizedTask} ifAppendingTask={ifAppendingTask} handleCompleteTask={handleCompleteTask} handleDeleteTask={handleDeleteTask}  tasks={tasks} color={color}/>
            </View>
        </View>

        {/* list configure board goes here  */}
        {
            fileStatus !== 'saved' && (
        <View style={{backgroundColor:hexColorWithOpacity('#4d4d4d',50)}} className='w-full h-32 py-4 '>
            <View className=" flex-row mx-4">
                <TouchableOpacity
                onPress={()=>{setConfigId(1)}}
                style={{
                    backgroundColor: configId === 1 ? color : hexColorWithOpacity(color,10)
                }} className="py-2 px-3 rounded-full mr-4">
                    <Text style={{
                        color : configId === 1 ? (lightOrDark(color) === "light" ? 'black' : 'white')  : color
                    }} className=" font-bold">Color</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{setConfigId(2)}}
                style={{
                    backgroundColor: configId === 2 ? color : hexColorWithOpacity(color,10)
                }} className="py-2 px-3 rounded-full mr-4">
                    <Text style={{
                        color : configId === 2 ?(lightOrDark(color) === "light" ? 'black' : 'white')  : color
                    }} className=" font-bold">Icon</Text>
                </TouchableOpacity>
            </View>
            <ScrollView 
            horizontal
            className="flex-1 px-4">
               {
                configId === 1 && (
                    <TouchableWithoutFeedback className="items-center justify-center flex-row"> 
                    {/* colors selection goes here  */}
                    <>
                    {
                        colorList.map((color, index)=> {
                            return (
                                <TouchableOpacity
                                onPress={()=>{
                                    setColorId(index+1)
                                }}
                                key={index}
                                style={[{
                                    width:selectionSize,
                                    height:selectionSize,
                                    backgroundColor:color,
                                }, index === colorList.length - 1 && {
                                    marginRight:30
                                }]}
                                className=" rounded-full self-center justify-center mr-2"
                            >
                                {
                                    colorId - 1 === index && (
                                        <View
                                        style={{
                                            width:14,
                                            height:14,
                                            backgroundColor:'#fff'
                                        }}
                                        className=" rounded-full self-center">
                    
                                        </View>
                                    )
                                }
                                </TouchableOpacity>
                            )
                        })
                    }
                    </>
               </TouchableWithoutFeedback>
                )
               }
                {
                configId === 2 && (
                    <TouchableWithoutFeedback className="items-center justify-center flex-row"> 
                    {/* colors selection goes here  */}
                    <>
                    {
                        iconList.map((item)=>(
                            <TouchableOpacity
                                onPress={()=>{
                                    setIconId(item.iconId)
                                }}
                                key={item.iconId}
                                style={{
                                    borderWidth: iconId === item.iconId ? 2 : 0,
                                    borderColor:hexColorWithOpacity(color,80),
                                    width:selectionSize,
                                    height:selectionSize,
                                    backgroundColor:hexColorWithOpacity(color,20),
                                }}
                                className="rounded-full self-center justify-center mr-2"
                            >
                                    <IconOption iconName={item.iconName} color={color} size={20} />
                                </TouchableOpacity>
                        ))
                    }
                    </>
               </TouchableWithoutFeedback>
                )
               }
            </ScrollView>
        </View>
            )
        }

        {
            fileStatus === 'saved' && (
                <View 
                style={{
                    backgroundColor:ifAddingTask ? todoThemeColor.configColor : 'transparent'
                }}
                className="w-full p-2 rounded-lg bottom-0"
                 >
                     <TouchableOpacity
                     activeOpacity={.8}
                     disabled={ifAddingTask}
                        onPress={()=>{
                            setifAddingTask(true)
                        }}
                        style={[{backgroundColor:todoThemeColor.configColor},
                            ifAddingTask && (
                                {
                                  
                                    backgroundColor:'transparent',
                                    borderWidth:1,
                                    borderColor:hexColorWithOpacity(color, 60)
                                }
                            ) 
                            ]}
                        className=" w-full rounded-lg flex-row h-12 justify-start items-center mb-4 pl-4 pr-2"
                    >
                    {
                        !ifAddingTask ? (
                           
                         <>
                            <Icon.Plus
                        width={32}
                        height={32}
                        color={color}
                        />
                        <Text
                            style={{color:color}}
                            className="text-md ml-4"
                        >
                            Add a Task
                        </Text>
                         </>

                        ) : (
                            <>
                            <TextInput
                            onSubmitEditing={()=>{
                                handleAddTask()
                                setifAddingTask(false)
                                
                            }}
                            value={newTask}
                            onChangeText={text => {setNewTask(text)}}
                            onBlur={()=>{
                                if(!newTask)
                                {
                                    resetTaskConfig()
                                }
                            }} 
                            style={{width:'90%'}}
                            autoFocus placeholderTextColor='#8c8c8c' className="  text-gray-300 h-full" placeholder='Add a task'/>
                            
                            {
                                newTask && (
                                    <TouchableOpacity
                                    onPress={handleAddTask}
                                    className="flex-1  h-full justify-center items-center">
                                <Icon.Send color={color}/>
                                </TouchableOpacity>
                                )
                            }
                           
                            </>
                        )
                    }
                    </TouchableOpacity>
                    {/* config new task here  */}
                    {
                        
                        ifAddingTask && (
                            <View style={{
                                width:'100%',
                                height:7* baseHeight,
                            }}
                                className="pt-0 flex-row justify-evenly items-start "
                            >
                                {
                                    importanceLevel === 1 ? 
                                    (
                                        <TouchableOpacity 
                                        className="rounded-full p-2 flex-row items-center"
                                            onPress={()=>{
                                                setModalVisible(true)
                                            }}
                                        >
                                            <IconOption size={24} iconName={'Bell'} color={hexColorWithOpacity(color,80)}/>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity 
                                        style={{borderColor:color}}
                                        className="rounded-full border p-2 flex-row items-center"
                                        onPress={()=>{
                                            setModalVisible(true)
                                        }}
                                    >
                                        {   
                                            importanceLevelList[importanceLevel - 1].icon(24)
                                        }
                                    </TouchableOpacity>
                                    )
                                }
                              
                                {
                                    !selectedDate ? 
                                    (
                                        <TouchableOpacity 
                                        onPress={()=>{
                                            setDateModalVisible(true)
                                        }}
                                        className="mx-6 p-2">
                                            <IconOption size={24} iconName={'Calendar'} color={hexColorWithOpacity(color,80)}/>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity 
                                        style={{backgroundColor:color}}
                                        className="rounded-full p-2 flex-row items-center"
                                        onPress={()=>{
                                            setDateModalVisible(true)
                                        }}
                                    >
                                            <IconOption size={24} iconName={'Calendar'} color={'#000'}/>
                                        <Text className="mx-1 ">
                                            {selectedDate}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={()=>{
                                                setSelectedDate(null)
                                            }}
                                        >
                                            <Icon.XCircle fill={'#000'} color={color} />

                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    )
                                }
                                <TouchableOpacity
                                    className="p-2"
                                    onPress={()=>{
                                        Alert.alert(underDevelopAlert)
                                    }}
                                >
                                    <IconOption size={24} iconName={'Clock'} color={hexColorWithOpacity(color,80)}/>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            )
        }
    {/* Modal stack for configuring each task  */}
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
    >
        <View 
        
        className="self-center  relative flex-1 w-full justify-center items-center">
            {/* modal bg mask goes here  */}
            <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                setModalVisible(false)
            }}
            style={{backgroundColor:'rgba(0,0,0,.6)'}} className="absolute w-full h-full">
            </TouchableOpacity>
            <View style={{backgroundColor:"#333333"}} className=" px-16 py-10 rounded-md">
                <Text style={{color:color}} className="text-lg font-bold self-center">
                    Urgency
                </Text>
                {
                    importanceLevelList.map(item => (
                        <TouchableOpacity  
                        onPress={()=>{
                            setImportanceLevel(item.id)
                        }}
                        key={item.id}
                        style={[{
                            backgroundColor:item.id === importanceLevel ? color : hexColorWithOpacity(color,10),
                        }]}
                        className="mx-4 rounded-md  my-3 justify-center items-center py-4">
                            <Text 
                            style={item.id !== importanceLevel && ({color:color})}
                            className="text-md font-bold mx-2">{item.level}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    </Modal>
    {/* DatePicker modal goes here  */}
    <Modal
        animationType="fade"
        transparent={true}
        visible={dateModalVisible}
    >
        <View 
        
        className="self-center  relative flex-1 w-full justify-center items-center">
            {/* modal bg mask goes here  */}
            <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                setDateModalVisible(false)
            }}
            style={{backgroundColor:'rgba(0,0,0,.6)'}} className="absolute w-full h-full">
            </TouchableOpacity>
            <View style={{backgroundColor:"#333333"}} className="pt-4 rounded-xl">
                {/* date picker goes here  */}
                <DatePicker
                 options={{
                    backgroundColor: todoThemeColor.configColorWithoutOpacity,
                    textHeaderColor: color,
                    textDefaultColor: '#ccc',
                    selectedTextColor: '#000',
                    mainColor: color,
                    textSecondaryColor: '#ccc',
                    borderColor: 'rgba(122, 146, 165, 0.1)',
                  }}
                  onSelectedChange={date => setSelectedDate(date)}
                  current={new Date().toISOString().slice(0,10)}
                  selected={new Date().toISOString().slice(0,10)}
                //   mode="calendar"
                  minuteInterval={1}
                className="rounded-xl"
                    style={{
                        width:350,
                    }}
                    
                  
                />
             </View>
        </View>
    </Modal>
    {/* Bottom SHeet background goes here  */}
    {
        ifBottomSheet && (
            <TouchableOpacity activeOpacity={1} onPress={handleClosePress} style={{height:'100%', backgroundColor:"rgba(0,0,0,.6)"}} className="h-full w-full z-1 absolute ">
                </TouchableOpacity>
        )
    }
    

     {/* Bottom sheet goes here  */}
     <BottomSheet
     backgroundStyle={{
        backgroundColor:'#333333'
     }}
      enablePanDownToClose={true}
      overDragResistanceFactor={10}
        ref={bottomSheetRef}
        index={-1}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <View className="" style={styles.contentContainer}>
            <View className="w-full flex-row relative justify-center items-center">
                <Text style={{}} className="text-lg font-semibold text-white">List Option</Text>
                <TouchableOpacity 
                onPress={handleClosePress}
                className=" absolute right-4 ">
                <Text style={{color:color}} className="font-semibold" >Done</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
            onPress={handleRename}
            className="w-full  py-3 mb-2 px-4 flex-row">
                <IconOption iconName={'Edit2'} color={'white'} size={18}/>
                <Text className="text-white ml-4">Edit</Text>
            </TouchableOpacity>
            {/* sort your list here  */}
            <SortDropDown ref={sortDropDownComRef} sortBy={sortBy} handleSortBy={handleSortBy} color={color}/>


            <TouchableOpacity 
            onPress={()=>{
                Alert.alert(underDevelopAlert)
            }}
            className="w-full  py-3 mb-2 px-4 flex-row">
                <IconOption iconName={'Sun'} color={color} size={18}/>
                <Text className="text-white ml-4">Make Your Day</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={()=>{
                    setIfDisplayDue(!ifDisplayDue)
                }}
            className="w-full  py-3 mb-2 px-4 flex-row">
                {
                    !ifDisplayDue ? (
                        <>
                            <IconOption iconName={'Eye'} color={'white'} size={18}/>
                           <Text className="text-white ml-4">Display Due Date</Text>
                        </>
                    ):(
                        <>
                            <IconOption iconName={'EyeOff'} color={'white'} size={18}/>
                           <Text className="text-white ml-4">Hide Due Date</Text>
                        </>
                    )
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteList} className="w-full  py-3 mb-2 px-4 flex-row">
                <IconOption iconName={'Trash2'} color={'red'} size={18}/>
                {
                    ifDeleting ? (
                        <View className="ml-4 flex-row justify-center items-center">
                            <Text className="text-red-600 ">Deleting...</Text>
                            <ActivityIndicator color={'#dc2626'} className="ml-1" />

                        </View>
                    ) : (
                        <Text className="text-red-600 ml-4">Delete List</Text>
                    )
                }
            </TouchableOpacity>
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop:48,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      zIndex:50,
    },
    shadowContainer:{
        ...Platform.select({
            ios: {
              shadowColor: '#8c8c8c',
              shadowOffset: { width: 1, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
            },
            android: {
              elevation: 5,
            },
        })
    }
  });