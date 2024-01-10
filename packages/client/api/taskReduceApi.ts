import { TaskType } from "@client/types";
import { useReducer } from "react";

export const TaskFunctions = {
  ADD: "add",
  CHANGE_PROGRESS: "change_progress",
  UPDATE_CHECKLIST: "update_checklist",
};

export function tasksReducerApi(tasks: any, action: any) {
  switch (action.type) {
    case TaskFunctions.ADD: {
      return [...tasks, action.task];
    }
    case TaskFunctions.CHANGE_PROGRESS: {
      return tasks.map((t: TaskType) => {
        if (t.taskId === action.taskId) {
          return { ...t, progress: action.progress };
        }
        return t;
      });
    }
    case TaskFunctions.UPDATE_CHECKLIST: {
      return tasks.map((t: TaskType) => {
        if (t.taskId === action.taskId) {
          const checklist = t.checklist.map((c: any) => {
            if (c.checklistId === action.checklistId) {
              return { ...c, checked: action.value };
            }
            return c;
          });
          return { ...t, checklist };
        }
        return t;
      });
    }
    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
}

export function useTaskReducer(tasks: any) {
  const [currentTasks, dispatch] = useReducer(tasksReducerApi, tasks);

  function modDispatch(type: any, payload: any) {
    dispatch({ type, ...payload });
  }
  return { currentTasks, modDispatch };
}
