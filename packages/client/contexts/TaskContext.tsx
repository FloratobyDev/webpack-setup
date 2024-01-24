import { ChecklistType, TaskType } from "@client/types";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { useRepository } from "./RepositoryContext";

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
  const { tasks, setTasks } = useRepository();

  function onUpdateTask(taskId: string, state: string) {
    console.log("update checklist", taskId, state);

    const newTaskProgress = tasks.map((t: TaskType) => {
      if (t.id === taskId) {
        return { ...t, state };
      }
      return t;
    });
    console.log("newTaskProgress", newTaskProgress, "tasks", tasks);

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
      console.log("update checklist", taskId, checklistId, value);
      const newTasks = tasks.map((t: TaskType) => {
        if (t.id === taskId) {
          const checklists = t.checklists.map((c: ChecklistType) => {
            if (c.id === checklistId) {
              return { ...c, is_done: value };
            }
            return c;
          });
          return { ...t, checklists };
        }
        return t;
      });
      console.log("new Tasks", newTasks);

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
    [tasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  if (!TaskContext) throw new Error("TaskContext is not defined");
  return useContext(TaskContext);
}

export default TaskProvider;
