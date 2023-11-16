import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import React, { useEffect, useRef, useState } from 'react'
import TaskItem from './TaskItem'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import todoThemeColor, { importanceLevelList } from '../contant'
import * as Icon from 'react-native-feather'
import ListDivider from './ListDivider'
import TaskListSection from './TaskListSection'
import { convertDateFormat, sortDeadlinesByDate } from '../util'


export default function TaskList({ifDisplayDue, sortBy, ifAppendingCategorizedTask,ifAppendingTask, color, tasks, handleDeleteTask, handleCompleteTask}) {
  const _tasks = tasks ? tasks : [];
  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ifShowComplete, setIfShowComplete] = useState(false)
  const [ifShowCasual, setIfShowCasual] = useState(true)
  const [ifShowModerate, setIfShowModerate] = useState(true)
  const [ifShowCritical, setIfShowCritical] = useState(true)
  const rotateValue = useSharedValue(0);
  const [todoTasks, setTodoTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  const [loadingText, setLoadingText] = useState('.');
  


  useEffect(() => {
    if (tasks) {
      setTodoTasks(_tasks.filter(task => !task.ifDone))
      setDoneTasks(_tasks.filter(task => task.ifDone))
      setTimeout(() => {
          setIsLoading(false)
      }, 500);
    }
  }, [tasks]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prevText) => {
        return prevText.length < 3 ? prevText + '.' : '.';
      });
    },  300);
   
    return () => clearInterval(intervalId);
  }, []);


  const rotatedAngle = useDerivedValue(() => {
    // Set the angle to 0 degrees when the condition is false, and 90 degrees when true
    return !ifShowComplete ? withTiming(-90) : withTiming(0);
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
     rotateValue.value = rotatedAngle.value;
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    };
  });

  const handleToggleComplete = ()=>{
    setIfShowComplete(!ifShowComplete)
  }

  const handleToggleCasual = ()=>{
    setIfShowCasual(!ifShowCasual)
  }

  const handleToggleModerate = ()=>{
    setIfShowModerate(!ifShowModerate)
  }

  const handleToggleCritical = ()=>{
    setIfShowCritical(!ifShowCritical)
  }

  return (
    <ScrollView ref={scrollRef} className="pt-2 relative">
    {isLoading ? (
      <ActivityIndicator style={{
        top:Dimensions.get('window').height * .3
      }} size="small" className=" absolute self-center" color={color} />
    ) : (
      <>
      {
        sortBy === 'importance' && (
          <>
             {/* this list is for high priority tasks  */}
      {
        <TaskListSection
        ifDisplayDue={ifDisplayDue}
        color={color}
        ifShowList={ifShowCritical}
        levelTasks={todoTasks.filter(task => task.importanceLevel === 3)}
        handleToggleStatus = {handleToggleCritical}
        handleDeleteTask={handleDeleteTask}
        handleCompleteTask={handleCompleteTask}
        scrollRef={scrollRef}
        loadingText={loadingText}
        ifAppendingTask={ifAppendingCategorizedTask === 'critical'}
        levelLabel={'critical'}
        ifBadge = {todoTasks.filter(task => task.importanceLevel === 3).length > 0}
      />
      }
      {/* this list is for moderate important tasks  */}
      {
        <TaskListSection
        ifDisplayDue={ifDisplayDue}

        color={color}
        ifShowList={ifShowModerate}
        levelTasks={todoTasks.filter(task => task.importanceLevel === 2)}
        handleToggleStatus = {handleToggleModerate}
        handleDeleteTask={handleDeleteTask}
        handleCompleteTask={handleCompleteTask}
        scrollRef={scrollRef}
        loadingText={loadingText}
        ifAppendingTask={ifAppendingCategorizedTask === 'moderate'}

        levelLabel={'moderate'}
        ifBadge = {todoTasks.filter(task => task.importanceLevel === 2).length > 0}
      />
      }
       {/* this list is for least important tasks  */}
       {
        <TaskListSection
        ifDisplayDue={ifDisplayDue}

          color={color}
          ifShowList={ifShowCasual}
          levelTasks={todoTasks.filter(task => task.importanceLevel === 1)}
          handleToggleStatus = {handleToggleCasual}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
          scrollRef={scrollRef}
          loadingText={loadingText}
          ifAppendingTask={ifAppendingCategorizedTask === 'casual'}
          levelLabel={'casual'}
          ifBadge = {todoTasks.filter(task => task.importanceLevel === 1).length > 0}
        />
      }
          </>
        )
      }
       {/* defaultly sorted list displayed here  */}
       {
        sortBy === 'regular' && (
          <TaskListSection
        ifDisplayDue={ifDisplayDue}

          color={color}
          ifShowList={true}
          levelTasks={todoTasks}
          handleToggleStatus = {()=>{}}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
          scrollRef={scrollRef}
          loadingText={loadingText}
          ifAppendingTask={ifAppendingTask}
          levelLabel={'undone'}
          ifBadge = {false}
        />
        )
      }

       {/* sort by due date list here  */}
       {
          sortBy === 'due' && (
            <TaskListSection
        ifDisplayDue={ifDisplayDue}

          color={color}
          ifShowList={true}
          levelTasks={sortDeadlinesByDate(todoTasks)}
          handleToggleStatus = {()=>{}}
          handleDeleteTask={handleDeleteTask}
          handleCompleteTask={handleCompleteTask}
          scrollRef={scrollRef}
          loadingText={loadingText}
          ifAppendingTask={ifAppendingTask}
          levelLabel={'due date'}
          ifBadge = {false}
        />
          )
        }

        {/* Completed tasks go here  */}
        {
          doneTasks.length > 0 && (
            <ListDivider 
            handleToggleComplete = {handleToggleComplete}
            color={color}
            ifShowDivider={ifShowComplete}
            dividerLabel={'Completed'}
            />
          )
        }


       

          {
            ifShowComplete && (
              doneTasks.map((taskItem) => {
                return (
                  <TaskItem
                    taskId={taskItem.taskId}
                    color={color}
                    key={taskItem.taskId}
                    task={taskItem.task}
                    ifDone={taskItem.ifDone}
                    simultaneousHandlers={scrollRef}
                    handleDeleteTask={handleDeleteTask}
                    handleCompleteTask={handleCompleteTask}
                  />
                )
              })
            )
        }
      </>
    )}
  </ScrollView>
  )
}