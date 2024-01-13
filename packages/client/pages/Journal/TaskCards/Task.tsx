import { ChecklistType, DifficultyTypes } from "@client/types";
import { filter, map, size } from "lodash";
import React, { useState } from "react";
import classNames from "classnames";
import { useTask } from "@client/contexts/TaskContext";
// import { headerTabs } from ".";

type Props = {
  taskInfo: {
    name: string;
    checklist: ChecklistType[];
    difficulty: string;
    progress: string;
    taskId: string;
  };
  progressTypes: {
    OPEN: string;
    INPROGRESS: string;
    DONE: string;
  };
  onProgressChange: (taskId: string, progress: string) => void;
};

type ChecklistProps = {
  item: ChecklistType;
  onRemove: () => void;
};

function Checklist({ item, onRemove }: ChecklistProps) {
  const [checked, setChecked] = useState(item.checked);
  return (
    <div className="flex gap-x-2">
      <input
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          onRemove();
        }}
        type="checkbox"
      />
      {/* <button type="button" onClick={onRemove}>X</button> */}
      <p>{item.description}</p>
    </div>
  );
}

function Task({ taskInfo, progressTypes, onProgressChange }: Props) {
  const [open, setOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(false); // ["task1", "task2"
  const { onUpdateChecklist } = useTask();

  function handleOpen() {
    setOpen(!open);
  }

  function handleOpenProgress(e: any) {
    e.stopPropagation();
    setOpenProgress(!openProgress);
  }

  const difficultyClass = classNames("h-2 w-2 bg-red-400 rounded-full", {
    "bg-green-400": taskInfo.difficulty === DifficultyTypes.EASY,
    "bg-red-400": taskInfo.difficulty === DifficultyTypes.HARD,
    "bg-yellow-400": taskInfo.difficulty === DifficultyTypes.MEDIUM,
  });

  const donePercentage =
    (size(filter(taskInfo.checklist, { checked: true })) /
      taskInfo.checklist.length) *
    100;

  const taskClass = classNames(
    "flex items-center justify-between p-2 px-3 relative",
    {
      "cursor-pointer": taskInfo.checklist.length > 0,
    }
  );

  return (
    <div className="rounded-md bg-black overflow-hidden select-none">
      <div
        className="h-1 bg-orange-400 transition-all duration-500 ease-in-out"
        style={{
          width: `${donePercentage}%`,
        }}
      />
      <div className={taskClass} onClick={handleOpen}>
        <p>{taskInfo.name}</p>
        <div className="flex items-center w-[30%] justify-between">
          <span className={difficultyClass} />
          <button className="capitalize p-1" onClick={handleOpenProgress}>
            {taskInfo.progress}
          </button>
        </div>
      </div>
      {openProgress && (
        <div className="absolute origin-top z-10 right-2 bg-black border-gray-200 border flex rounded-md flex-col overflow-hidden">
          {map(progressTypes, (tab) => {
            return (
              <p
                className="px-1"
                key={tab}
                onClick={() => {
                  onProgressChange(taskInfo.taskId, tab);
                  setOpenProgress(false);
                }}
              >
                {tab}
              </p>
            );
          })}
        </div>
      )}

      {open && taskInfo.checklist.length > 0 && (
        <>
          <hr className="border-t-1 border-t-yellow-300" />
          <div>
            {map(taskInfo.checklist, (item) => (
              <Checklist
                item={item}
                key={item.checklistId}
                onRemove={onUpdateChecklist(
                  taskInfo.taskId,
                  item.checklistId,
                  !item.checked
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Task;
