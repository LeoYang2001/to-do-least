import { View, Text } from 'react-native'
import React from 'react'
import { importanceLevelList } from '../contant'
import ListDivider from './ListDivider'
import TaskItem from './TaskItem'

export default function TaskListSection(
    {
        ifDisplayDue,
        levelLabel,
        color,
        ifShowList,
        levelTasks,
        handleCompleteTask,
        handleDeleteTask,
        scrollRef,
        loadingText,
        ifAppendingTask,
        ifBadge,
        handleToggleStatus
    }

    ) {
  return (
    <>
     {/* this list is for least important tasks  */}
     {
        ifBadge && (
            <ListDivider 
            handleToggleComplete = {handleToggleStatus}
            color={color}
            ifShowDivider={ifShowList}
            dividerLabel={levelLabel}
            />
        )
        }
       {/* this list is for least important tasks  */}
        {
            ifShowList && (
                levelTasks.map((taskItem) => {
                    return (
                      <TaskItem
                      ifDisplayDue={ifDisplayDue}
                        taskId={taskItem.taskId}
                        color={color}
                        deadLine={taskItem.deadLine}
                        key={taskItem.taskId}
                        task={taskItem.task}
                        ifDone={taskItem.ifDone}
                        simultaneousHandlers={scrollRef}
                        handleDeleteTask={handleDeleteTask}
                        handleCompleteTask={handleCompleteTask}
                        iconView = {importanceLevelList[taskItem.importanceLevel - 1].icon(20)}
                      />
                    )
                  })
            )
        }
        {
        ifAppendingTask && (
          // this item is only for ui improvement, only will be manifested when 
          // adding a new task as a placeholder
          <TaskItem
                  taskId={'appendingPlaceHolder'}
                  color={color}
                  key={'appendingPlaceHolder'}
                  task={loadingText}
                  ifDone={false}
                  simultaneousHandlers={scrollRef}
                  handleDeleteTask={handleDeleteTask}
                  handleCompleteTask={handleCompleteTask}
                />
        )
      }

    </>
  )
}