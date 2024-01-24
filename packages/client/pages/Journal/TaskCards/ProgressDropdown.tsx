import { ProgressValues, TaskType } from "@client/types";
import { map } from "lodash";
import React from "react";
import { useTask } from "@client/contexts/TaskContext";

type Props = {
  taskInfo: TaskType;
  setOpenProgress: (open: boolean) => void;
};

function ProgressDropdown({ taskInfo, setOpenProgress }: Props) {
  const { onUpdateTask } = useTask();
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
              onUpdateTask(taskInfo.id, tab);
              setOpenProgress(false);
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
