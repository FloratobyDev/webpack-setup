import { ProgressValues, TaskType } from "@client/types";
import React, { useEffect } from "react";
import { map } from "lodash";
import { useTask } from "@client/contexts/TaskContext";
import { useUpdateTaskStateMutation } from "@client/store";
import ReactDOM from "react-dom";

type Props = {
  taskInfo: TaskType;
  setOpenProgress: (open: boolean) => void;
};

function ProgressDropdown({ taskInfo, setOpenProgress }: Props) {
  const { onUpdateTask } = useTask();
  const [
    mutateTaskState,
    {
      isLoading: isTaskLoading,
      data: taskData,
      isSuccess: isTaskSuccess,
      isError: isTaskError,
      error: taskError,
    },
  ] = useUpdateTaskStateMutation();

  useEffect(() => {
    if (isTaskSuccess) {
      const { state: tab, id } = taskData;
      onUpdateTask(id, tab);
      setOpenProgress(false);
    }
  }, [isTaskSuccess]);

  return (
    <div
      className="absolute z-10 right-0 top-11 shadow-sm shadow-black bg-black-75 flex rounded-md flex-col overflow-hidden p-2"
      data-testid={`${taskInfo.id}-progress`}
    >
      {map(ProgressValues, (tab) => {
        return (
          <button
            className="px-1 hover:bg-primary-yellow hover:text-primary-black whitespace-nowrap rounded-md text-primary-yellow"
            key={tab}
            onClick={() => {
              mutateTaskState({
                id: taskInfo.id,
                state: tab,
              });
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default ProgressDropdown;
