import { ChecklistType, TaskType } from "@client/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRepository } from "./RepositoryContext";

type TaskContextType = {
  tasks: TaskType[];
  onUpdateTask: (id: string, progress: string) => void;
  onAddTask: (task: TaskType) => void;
  onUpdateChecklist: (
    taskId: string,
    checklistId: string,
    value: boolean,
  ) => void;
  onUpdateId: (oldId: string, newId: string) => void;
  onRemoveTask: (taskId: string) => void;
  updateChecklistByTaskId: (
    taskId: string,
    newChecklist: ChecklistType[],
  ) => void;
  synching: {
    value: boolean;
    taskId: string;
  };
  setSynching: (value: { value: boolean; taskId: string }) => void;
};

const TaskContext = createContext<TaskContextType>(undefined);

type Props = {
  children: ReactNode;
};

function TaskProvider({ children }: Props) {
  const { tasks, setTasks } = useRepository();
  const [synching, setSynching] = useState({
    value: false,
    taskId: "",
  });

  function onUpdateId(oldId: string, newId: string) {
    setTasks((prevTasks) => {
      const newTaskIdSync = prevTasks.map((t: TaskType) => {
        if (String(t.id) === oldId) {
          return { ...t, id: newId };
        }
        return t;
      });
      return newTaskIdSync;
    });
    // const newTaskIdSync = tasks.map((t: TaskType) => {
    //   if (String(t.id) === oldId) {
    //     return { ...t, id: newId };
    //   }
    //   return t;
    // });
    // console.log("newId", newTaskIdSync, "tasks", tasks);

    // setTasks(newTaskIdSync);
  }

  function onUpdateTask(taskId: string, state: string) {
    console.log("update checklist", taskId, state, tasks);

    const newTaskProgress = tasks.map((t: TaskType) => {
      if (String(t.id) === String(taskId)) {
        console.log("changin task");

        return { ...t, state };
      }
      return t;
    });

    setTasks(newTaskProgress);
  }

  function onAddTask(task: TaskType) {
    setTasks([...tasks, task]);
  }

  function onRemoveTask(taskId: string) {
    const newTasks = tasks.filter((t: TaskType) => t.id !== taskId);
    setTasks(newTasks);
  }

  // function onUpdateChecklistId

  function updateChecklistByTaskId(
    taskId: string,
    newChecklist: ChecklistType[],
  ) {
    console.log("tasks", tasks, taskId);

    const newTasks = tasks.map((t: TaskType) => {
      if (t.id === taskId) {
        console.log("new checklist", newChecklist, taskId, t.id);
        return { ...t, checklists: newChecklist };
      }
      return t;
    });

    console.log("newTask", newTasks);

    setTasks(newTasks);
  }

  useEffect(() => {
    console.log("tasks UPDATE: ", tasks);
  }, [tasks]);

  function onUpdateChecklist(
    taskId: string,
    checklistId: string,
    value: boolean,
  ) {
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
  }

  const value: TaskContextType = useMemo(
    () => ({
      tasks,
      onUpdateTask,
      onAddTask,
      onUpdateChecklist,
      onUpdateId,
      onRemoveTask,
      updateChecklistByTaskId,
      synching,
      setSynching,
    }),
    [tasks, synching],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTask() {
  if (!TaskContext) throw new Error("TaskContext is not defined");
  return useContext(TaskContext);
}

export default TaskProvider;
