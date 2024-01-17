import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { TaskType } from "@client/types";
import { useRepository } from "./RepositoryContext";

type TaskContextType = {
  tasks: TaskType[];
  onUpdateTask: (id: string, progress: string) => void;
  onAddTask: (task: TaskType) => void;
  onUpdateChecklist: (
    taskId: string,
    checklistId: string,
    value: boolean
  ) => () => void;
};

const TaskContext = createContext<TaskContextType>(undefined);

type Props = {
  children: ReactNode;
};

function TaskProvider({ children }: Props) {
  const { tasks, setTasks } = useRepository();

  function onUpdateTask(taskId: string, progress: string) {
    console.log("update checklist", taskId, progress);

    const newTaskProgress = tasks.map((t: TaskType) => {
      if (t.taskId === taskId) {
        return { ...t, progress };
      }
      return t;
    });

    setTasks(newTaskProgress);
  }

  function onAddTask(task: TaskType) {
    setTasks([...tasks, task]);
  }

  function onUpdateChecklist(
    taskId: string,
    checklistId: string,
    value: boolean,
  ) {
    return () => {
      const newTasks = tasks.map((t: TaskType) => {
        if (t.taskId === taskId) {
          const checklist = t.checklist.map((c: any) => {
            if (c.checklistId === checklistId) {
              return { ...c, checked: value };
            }
            return c;
          });
          return { ...t, checklist };
        }
        return t;
      });
      setTasks(newTasks);
    };
  }

  const value: TaskContextType = useMemo(
    () => ({
      tasks,
      onUpdateTask,
      onAddTask,
      onUpdateChecklist,
    }),
    [tasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  if (!TaskContext) throw new Error("TaskContext is not defined");
  return useContext(TaskContext);
}

export default TaskProvider;
