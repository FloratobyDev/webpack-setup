import { ChecklistType, DifficultyTypes, ProgressType } from "@client/types";
import React, { useRef, useState } from "react";
import ChecklistDropdown from "./ChecklistDropdown";
import classNames from "classnames";
import Difficulty from "@client/components/svgs/Difficulty";
import DifficultyDropdown from "./DifficultyDropdown";
import { generateRandomString } from "@client/utils";
import { H2 } from "@client/components/headings";
import useOutsideClick from "@client/hooks/useOutsideClick";
import { useTask } from "@client/contexts/TaskContext";

function TaskEditor() {
  const [openChecklist, setOpenChecklist] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState<string>("");
  const [checklist, setChecklist] = useState<ChecklistType[]>([]);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [difficulty, setDifficulty] = useState(DifficultyTypes.EASY);
  const [openDeadline, setOpenDeadline] = useState(false);
  const [taskName, setTaskName] = useState("");
  const { onAddTask } = useTask();

  const checkListRef = useRef(null);
  const difficultyRef = useRef(null);
  const deadlineRef = useRef(null);

  function handleOpenChecklist() {
    setOpenChecklist(!openChecklist);
    setOpenDifficulty(false);
  }

  function onAddCheck() {
    if (currentChecklist.length <= 0) return;
    setChecklist([
      ...checklist,
      {
        description: currentChecklist,
        checked: false,
        checklistId: generateRandomString(5),
      },
    ]);
    setCurrentChecklist("");
  }

  function handleOpenDifficulty() {
    setOpenDifficulty(!openDifficulty);
    setOpenChecklist(false);
  }

  function onTaskNameChange(e: any) {
    setTaskName(e.target.value);
  }

  function onDifficultyClick(difficultyType: string) {
    return () => {
      setDifficulty(difficultyType);
      setOpenDifficulty(false);
    };
  }

  function handleOpenDeadline() {
    setOpenDeadline(!openDeadline);
  }

  useOutsideClick(checkListRef, openChecklist, () => {
    setOpenChecklist(false);
  });
  useOutsideClick(difficultyRef, openDifficulty, () => {
    setOpenDifficulty(false);
  });
  useOutsideClick(deadlineRef, openDeadline, () => {
    setOpenDeadline(false);
  });

  const difficultyClass = classNames(
    "absolute h-2 w-2 bg-red-400 top-0 right-0 rounded-full",
    {
      "bg-green-400": difficulty === DifficultyTypes.EASY,
      "bg-red-400": difficulty === DifficultyTypes.HARD,
      "bg-yellow-400": difficulty === DifficultyTypes.MEDIUM,
    }
  );

  return (
    <div className="flex h-full flex-col justify-between relative">
      <div>
        <H2>Tasks</H2>
        <div className="flex justify-between bg-gray-200 p-2 items-end rounded-md gap-x-2 text-black">
          <textarea
            className="grow border border-gray-300 w-full rounded-lg focus:outline-none focus:border-blue-500 resize-none h-20"
            onChange={onTaskNameChange}
            placeholder="Write task here..."
            value={taskName}
          />
          <div className="flex items-center gap-x-2">
            <button className="relative" onClick={handleOpenDifficulty}>
              <span className={difficultyClass} />
              <Difficulty />
            </button>
            <button onClick={handleOpenChecklist}>
              <span className="whitespace-nowrap">
                {checklist.length > 0 ? `+${checklist.length}` : ""} Addc
              </span>
            </button>
          </div>
        </div>
      </div>
      {openChecklist && (
        <ChecklistDropdown
          checklist={checklist}
          currentChecklist={currentChecklist}
          onAddCheck={onAddCheck}
          ref={checkListRef}
          setChecklist={setChecklist}
          setCurrentChecklist={setCurrentChecklist}
        />
      )}
      {openDifficulty && (
        <DifficultyDropdown
          onDifficultyClick={onDifficultyClick}
          ref={difficultyRef}
        />
      )}
      {openDeadline && (
        <div
          className="flex justify-between flex-col items-start absolute h-24 bg-black w-full top-[14.25rem] z-10"
          ref={deadlineRef}
        >
          <input type="date" />
        </div>
      )}
      <div>
        <button className="btn btn-primary" onClick={handleOpenDeadline}>
          Deadline
        </button>
        <button
          onClick={() => {
            onAddTask({
              name: taskName,
              checklist,
              difficulty,
              progress: ProgressType.OPEN,
              taskId: generateRandomString(10),
            });

            setTaskName("");
            setChecklist([]);
            setDifficulty(DifficultyTypes.EASY);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default TaskEditor;
