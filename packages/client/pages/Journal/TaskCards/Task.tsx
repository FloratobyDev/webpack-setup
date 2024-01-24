import { ChecklistType, DifficultyTypes, TaskType } from "@client/types";
import { filter, map, size } from "lodash";
import React, { useState } from "react";
import classNames from "classnames";
import ProgressDropdown from "./ProgressDropdown";
import { useTask } from "@client/contexts/TaskContext";
// import { headerTabs } from ".";

type Props = {
  taskInfo: TaskType;
};

type ChecklistProps = {
  item: ChecklistType;
  onRemove: () => void;
};

function Checklist({ item, onRemove }: ChecklistProps) {
  const [checked, setChecked] = useState(item.is_done);
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
      <p>{item.content}</p>
    </div>
  );
}

function Task({ taskInfo }: Props) {
  const [open, setOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const { onUpdateChecklist } = useTask();

  function handleOpen() {
    setOpen(!open);
  }

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
    "flex items-center justify-between p-2 px-3 relative",
    {
      "cursor-pointer": taskInfo.checklists.length > 0,
    },
  );

  return (
    <div
      className="rounded-md bg-black overflow-hidden select-none"
      data-testid={taskInfo.id}
    >
      <div
        className="h-1 bg-orange-400 transition-all duration-500 ease-in-out"
        style={{
          width: `${donePercentage}%`,
        }}
      />
      <div className={taskClass} onClick={handleOpen}>
        <p>{taskInfo.title}</p>
        <div className="flex items-center w-[30%] justify-between">
          <span className={difficultyClass} />
          <button
            className="capitalize p-1"
            onClick={(e) => {
              handleOpenProgress(e);
            }}
          >
            {taskInfo.state}
          </button>
        </div>
      </div>
      {openProgress && (
        <ProgressDropdown
          setOpenProgress={setOpenProgress}
          taskInfo={taskInfo}
        />
      )}

      {open && taskInfo.checklists.length > 0 && (
        <>
          <hr className="border-t-1 border-t-yellow-300" />
          <div>
            {map(taskInfo.checklists, (item) => (
              <Checklist
                item={item}
                key={item.id}
                onRemove={onUpdateChecklist(
                  taskInfo.id,
                  item.id,
                  !item.is_done,
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
