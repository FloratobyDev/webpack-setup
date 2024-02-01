import { ChecklistType, DifficultyTypes, ProgressValues } from "@client/types";
import React, { useEffect, useRef, useState } from "react";
import ChecklistDropdown from "./ChecklistDropdown";
import classNames from "classnames";
import DifficultyDropdown from "./DifficultyDropdown";
import { generateRandomString } from "@client/utils";
import { H2 } from "@client/components/headings";
import Paper from "@client/components/layout/Paper";
import { useAddTasksMutation } from "@client/store";
import useOutsideClick from "@client/hooks/useOutsideClick";
import { useRepository } from "@client/contexts/RepositoryContext";
import { useTask } from "@client/contexts/TaskContext";

function TaskEditor() {
  const [openChecklist, setOpenChecklist] = useState(false);
  const [checklists, setChecklists] = useState<ChecklistType[]>([
    {
      content: "This is a checklist",
      is_done: false,
      id: generateRandomString(10),
    },
    {
      content: "This is a checklist",
      is_done: false,
      id: generateRandomString(10),
    },
  ]);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [difficulty, setDifficulty] = useState(DifficultyTypes.EASY);
  const [openDeadline, setOpenDeadline] = useState(false);
  const [taskName, setTaskName] = useState("");
  const { onAddTask } = useTask();

  const checkListRef = useRef(null);
  const difficultyRef = useRef(null);
  const deadlineRef = useRef(null);

  const [addTask, { isSuccess, isLoading, data }] = useAddTasksMutation();
  const { currentRepository } = useRepository();

  useEffect(() => {
    if (isSuccess) {
      onAddTask({
        title: taskName,
        checklists: data.checklists,
        difficulty,
        state: ProgressValues.OPEN,
        id: String(data.id),
      });
      setChecklists([]);
      setDifficulty(DifficultyTypes.EASY);
      setTaskName("");
    }
  }, [isSuccess]);

  function handleOpenChecklist() {
    setOpenChecklist(!openChecklist);
    setOpenDifficulty(false);
  }

  function onAddCheck(currentChecklist: string) {
    setChecklists([
      ...checklists,
      {
        content: currentChecklist,
        is_done: false,
        id: generateRandomString(10),
      },
    ]);
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
    "absolute h-2 w-2 top-0 right-0 rounded-full",
    {
      "bg-green-400": difficulty === DifficultyTypes.EASY,
      "bg-red-400": difficulty === DifficultyTypes.HARD,
      "bg-yellow-400": difficulty === DifficultyTypes.MEDIUM,
    },
  );

  return (
    <Paper classname="flex gap-y-2 h-full flex-col justify-between">
      <div className="flex flex-col gap-y-4">
        <H2 classname="text-primary-yellow font-semibold">Tasks</H2>
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between bg-primary-black p-2 items-end rounded-[6px] gap-x-2 text-black h-9">
            <input
              className="bg-transparent outline-none text-paragraph placeholder:text-sm placeholder:font-poppins font-poppins font-normal text-sm flex w-[90%]"
              onChange={onTaskNameChange}
              placeholder="Write task here..."
              type="text"
              value={taskName}
            />
          </div>
          <ChecklistDropdown
            checklist={checklists}
            onAddCheck={onAddCheck}
            ref={checkListRef}
            setChecklist={setChecklists}
          />
        </div>
      </div>

      <div className="flex gap-x-2">
        <div className="relative">
          <button
            className="rounded-md px-3 py-1.5 text-primary-yellow flex items-center bg-primary-black gap-x-2 cursor-pointer"
            onClick={handleOpenDeadline}
          >
            <p className="font-poppins font-semibold">09/09/2024</p>
            <div className="h-full w-[1px] bg-primary-yellow" />
            <svg
              fill="none"
              height="6"
              viewBox="0 0 7 6"
              width="7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.36602 5.45801C3.98112 6.12468 3.01887 6.12467 2.63397 5.45801L0.468911 1.70801C0.0840111 1.04134 0.565137 0.208007 1.33494 0.208007L5.66507 0.208008C6.43487 0.208008 6.91599 1.04134 6.53109 1.70801L4.36602 5.45801Z"
                fill="#DFB626"
              />
            </svg>
          </button>
          {openDeadline && (
            <div
              className="flex justify-between flex-col items-start absolute h-24 bg-black w-full z-10"
              ref={deadlineRef}
            >
              <input type="date" />
            </div>
          )}
        </div>
        <div className="relative">
          <button
            className="rounded-md px-3 py-1.5 text-primary-yellow flex items-center bg-primary-black gap-x-2 cursor-pointer"
            onClick={handleOpenDifficulty}
          >
            <p className="font-poppins font-semibold">Diff</p>
          </button>
          {openDifficulty && (
            <DifficultyDropdown
              onDifficultyClick={onDifficultyClick}
              ref={difficultyRef}
            />
          )}
        </div>
        <button
          className="rounded-md px-3 py-1.5 text-primary-black flex items-center bg-primary-yellow gap-x-2 cursor-pointer"
          onClick={() => {
            addTask({
              newTask: {
                title: taskName,
                checklists,
                difficulty,
                state: ProgressValues.OPEN,
                id: generateRandomString(5),
              },
              rest: {
                repo_id: currentRepository?.id,
              },
            });
          }}
        >
          {isLoading && (
            <p className="font-poppins font-semibold">Loading...</p>
          )}
          {!isLoading && <p className="font-poppins font-semibold">Send</p>}
        </button>
      </div>
    </Paper>
  );
}

export default TaskEditor;
