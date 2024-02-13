import { ProgressValues, TaskType } from "@client/types";
import React, { forwardRef, RefObject, useEffect } from "react";
import classNames from "classnames";
import { map } from "lodash";
import { useTask } from "@client/contexts/TaskContext";
import { useUpdateTaskStateMutation } from "@client/store";

type Props = {
  taskInfo: TaskType;
  setOpenProgress: (open: boolean) => void;
  position: "bottom" | "top";
};

function ProgressDropdown(
  { taskInfo, setOpenProgress, position }: Props,
  ref: RefObject<HTMLDivElement>,
) {
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

  const divClasses = classNames(
    "absolute z-10 right-0 shadow-black bg-primary-black border border-primary-outline flex rounded-smd flex-col overflow-hidden p-1 text-md",
    {
      "top-10": position === "bottom",
      "bottom-10": position === "top",
    },
  );

  return (
    <div
      className={divClasses}
      data-testid={`${taskInfo.id}-progress`}
      ref={ref}
    >
      {map(ProgressValues, (tab) => {
        return (
          <button
            className="px-1 hover:bg-black-75 whitespace-nowrap rounded-smd text-paragraph"
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

export default forwardRef(ProgressDropdown);
