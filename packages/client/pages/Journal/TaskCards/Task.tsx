import { ChecklistType, DifficultyTypes, TaskType } from "@client/types";
import { debounce, filter, map, size } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import ProgressDropdown from "./ProgressDropdown";
import RadioButton from "@client/components/buttons/RadioButton";
import { useTask } from "@client/contexts/TaskContext";
import { useUpdateChecklistMutation } from "@client/store";
// import { headerTabs } from ".";

type Props = {
  taskInfo: TaskType;
};

type ChecklistProps = {
  item: ChecklistType;
  onRemove: () => void;
};
// TODO: Add error handling in case of failure
function Checklist({ item, onRemove }: ChecklistProps) {
  return (
    <div className="flex gap-x-2 items-center py-1">
      <RadioButton
        checked={item.is_done}
        onClick={() => {
          onRemove();
        }}
      />
      <p>{item.content}</p>
    </div>
  );
}

function Task({ taskInfo }: Props) {
  const [open, setOpen] = useState(true);
  const [openProgress, setOpenProgress] = useState(false);
  const { onUpdateChecklist } = useTask();
  const [mutateChecklist, { isLoading, data, isSuccess, isError, error }] =
    useUpdateChecklistMutation();

  function handleOpen() {
    setOpen(!open);
  }

  useEffect(() => {
    if (isError) {
      onUpdateChecklist(taskInfo.id, data?.id, !data?.is_done);
    }
  }, [isSuccess]);

  const debouncedMutateChecklist = useCallback(
    debounce((taskId, checklistId, isDone) => {
      mutateChecklist({ taskId, checklistId, isDone });
    }, 200),
    [],
  );

  if (!taskInfo) {
    return null;
  }

  function handleOpenProgress(e: any) {
    e.stopPropagation();
    setOpenProgress(!openProgress);
  }

  const difficultyClass = classNames("h-2 w-2 rounded-full", {
    "bg-green-400": taskInfo.difficulty === DifficultyTypes.EASY,
    "bg-red-400": taskInfo.difficulty === DifficultyTypes.HARD,
    "bg-yellow-400": taskInfo.difficulty === DifficultyTypes.MEDIUM,
  });

  const donePercentage =
    (size(filter(taskInfo.checklists, { is_done: true })) /
      taskInfo.checklists.length) *
    100;

  const taskClass = classNames(
    "flex items-center justify-between p-2 px-3 relative text-lg",
    {
      "cursor-pointer": taskInfo.checklists.length > 0,
    },
  );

  return (
    <div
      className="rounded-md bg-primary-black select-none my-2 font-jost"
      data-testid={taskInfo.id}
    >
      <div
        className="h-1 bg-primary-yellow transition-all duration-500 ease-in-out rounded-t-md"
        style={{
          width: `${donePercentage}%`,
          visibility: !donePercentage ? "hidden" : "visible",
        }}
      />
      <div className={taskClass} onClick={handleOpen}>
        <p>{taskInfo.title}</p>
        <div className="flex items-center gap-x-2 justify-between">
          <span className={difficultyClass} />
          <div className="relative">
            <button
              className="capitalize py-1 px-3 text-primary-yellow cursor-pointer rounded-md hover:bg-black-75 whitespace-nowrap"
              onClick={(e) => {
                handleOpenProgress(e);
              }}
            >
              {taskInfo.state}
            </button>
            {openProgress && (
              <ProgressDropdown
                setOpenProgress={setOpenProgress}
                taskInfo={taskInfo}
              />
            )}
          </div>
        </div>
      </div>

      {open && taskInfo.checklists.length > 0 && (
        <>
          <hr className="border-t-1 border-t-primary-yellow" />
          <div className="py-2 px-4">
            {map(taskInfo.checklists, (item) => (
              <Checklist
                item={item}
                key={item.id}
                onRemove={() => {
                  onUpdateChecklist(taskInfo.id, item.id, !item.is_done);
                  debouncedMutateChecklist(taskInfo.id, item.id, !item.is_done);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Task;
