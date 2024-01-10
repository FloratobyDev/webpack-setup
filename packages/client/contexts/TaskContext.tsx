import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { TaskFunctions, useTaskReducer } from "../api/taskReduceApi";
import { generateRandomString } from "@client/utils";
import { TaskType } from "@client/types";

type TaskContextType = {
  tasks: TaskType[];
  onUpdateTask: (id: string, progress: string) => void;
  onAddTask: (task: TaskType) => void;
  onUpdateChecklist: (
    taskId: string,
    checklistId: string,
    value: boolean,
  ) => () => void;
};

const TaskContext = createContext<TaskContextType>(undefined);

type Props = {
  children: ReactNode;
};

function TaskProvider({ children }: Props) {
  const initialTaskValue = [
    {
      name: "Task 1",
      checklist: [
        {
          checklistId: generateRandomString(5),
          description: "check 1",
          checked: false,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 2",
          checked: true,
        },
      ],
      progress: "Open",
      difficulty: "easy",
      taskId: generateRandomString(5),
    },
    {
      name: "Task 2",
      checklist: [
        {
          checklistId: generateRandomString(5),
          description: "check 1",
          checked: false,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 2",
          checked: true,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 3",
          checked: false,
        },
      ],
      progress: "In-Progress",
      difficulty: "medium",
      taskId: generateRandomString(5),
    },
    {
      name: "Task 3",
      checklist: [
        {
          checklistId: generateRandomString(5),
          description: "check 1",
          checked: false,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 2",
          checked: true,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 3",
          checked: false,
        },
        {
          checklistId: generateRandomString(5),
          description: "check 4",
          checked: false,
        },
      ],
      progress: "Done",
      difficulty: "hard",
      taskId: generateRandomString(5),
    },
  ];
  const { currentTasks, modDispatch } = useTaskReducer(initialTaskValue);

  function onUpdateTask(taskId: string, progress: string) {
    modDispatch(TaskFunctions.CHANGE_PROGRESS, { taskId, progress });
  }

  function onAddTask(task: TaskType) {
    modDispatch(TaskFunctions.ADD, { task });
  }

  function onUpdateChecklist(
    taskId: string,
    checklistId: string,
    value: boolean,
  ) {
    return () => {
      modDispatch(TaskFunctions.UPDATE_CHECKLIST, {
        taskId,
        checklistId,
        value,
      });
    };
  }

  const value: TaskContextType = useMemo(
    () => ({
      tasks: currentTasks,
      onUpdateTask,
      onAddTask,
      onUpdateChecklist,
    }),
    [currentTasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  if (!TaskContext) throw new Error("TaskContext is not defined");
  return useContext(TaskContext);
}

export default TaskProvider;
