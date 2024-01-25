import { ProgressValues, TaskType } from "@client/types";
import React, { useEffect } from "react";
import { map } from "lodash";
import { useTask } from "@client/contexts/TaskContext";
import { useUpdateTaskStateMutation } from "@client/store";

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
      className="absolute origin-top z-10 right-2 bg-black border-gray-200 border flex rounded-md flex-col overflow-hidden"
      data-testid={`${taskInfo.id}-progress`}
    >
      {map(ProgressValues, (tab) => {
        return (
          <button
            className="px-1"
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
