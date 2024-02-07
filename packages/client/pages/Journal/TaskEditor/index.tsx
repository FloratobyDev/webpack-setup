import { ChecklistType, DifficultyTypes, ProgressValues } from "@client/types";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
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
  const [openChecklist, setOpenChecklist] = useState(true);
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
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

  const [dueDate, setDueDate] = useState(null);

  return (
    <Paper classname="flex gap-y-2 h-full flex-col justify-between">
      <div className="flex flex-col gap-y-2">
        <H2 classname="text-primary-yellow font-black text-lg">Tasks</H2>
        <div className="flex flex-col gap-y-2">
          <div className="flex bg-primary-black p-3 items-center rounded-smd gap-x-2 text-black h-9">
            <input
              className="bg-transparent outline-none text-paragraph placeholder:text-paragraph placeholder:text-md focus:placeholder:text-transparent text-md flex w-[90%]"
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
        <div className="relative h-full" ref={deadlineRef}>
          <button
            className="rounded-md h-full px-3 py-1.5 text-paragraph flex items-center bg-primary-black gap-x-2 cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDeadline();
            }}
          >
            <p className="font-extrabold text-sm">{dueDate || "No deadline"}</p>
            <div className="h-4 w-[1px] bg-paragraph" />
            <svg
              fill="none"
              height="6"
              viewBox="0 0 7 6"
              width="7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.36602 5.45801C3.98112 6.12468 3.01887 6.12467 2.63397 5.45801L0.468911 1.70801C0.0840111 1.04134 0.565137 0.208007 1.33494 0.208007L5.66507 0.208008C6.43487 0.208008 6.91599 1.04134 6.53109 1.70801L4.36602 5.45801Z"
                fill="#F0F0F0"
              />
            </svg>
          </button>
          {openDeadline && (
            <div className="flex justify-between flex-col items-start absolute h-full z-10 top-10  w-56">
              <Calendar
                onChange={(date) => {
                  setOpenDeadline(false);
                  setDueDate(date);
                }}
              />
              {/* <input type="date" /> */}
            </div>
          )}
        </div>
        <div className="relative" ref={difficultyRef}>
          <button
            className="rounded-smd px-3 py-1.5 font-extrabold text-sm text-paragraph flex items-center bg-primary-black gap-x-2 cursor-pointer hover:opacity-80"
            onClick={handleOpenDifficulty}
          >
            <p className="capitalize text-sm font-extrabold">{difficulty}</p>
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 32"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_393_346)">
                <path
                  clipRule="evenodd"
                  d="M17 23.458C21.4183 23.458 25 19.8763 25 15.458C25 11.0397 21.4183 7.45801 17 7.45801C12.5817 7.45801 9 11.0397 9 15.458C9 19.8763 12.5817 23.458 17 23.458ZM17 21.458C20.3137 21.458 23 18.7717 23 15.458C23 12.1443 20.3137 9.45801 17 9.45801C13.6863 9.45801 11 12.1443 11 15.458C11 18.7717 13.6863 21.458 17 21.458Z"
                  fill="#F0F0F0"
                  fillRule="evenodd"
                />
                <circle cx="16.9982" cy="15.458" fill="#F0F0F0" r="2.27947" />
                <rect
                  fill="#F0F0F0"
                  height="2.06989"
                  rx="1.03495"
                  transform="rotate(-45 15.5352 15.458)"
                  width="10.2236"
                  x="15.5352"
                  y="15.458"
                />
              </g>
              <defs>
                <filter
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                  height="34"
                  id="filter0_d_393_346"
                  width="34"
                  x="0"
                  y="0.458008"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    result="hardAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feMorphology
                    in="SourceAlpha"
                    operator="dilate"
                    radius="1"
                    result="effect1_dropShadow_393_346"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="4" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="effect1_dropShadow_393_346"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow_393_346"
                    mode="normal"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
          {openDifficulty && (
            <DifficultyDropdown onDifficultyClick={onDifficultyClick} />
          )}
        </div>
        <button
          className="rounded-smd px-3 py-1.5 text-primary-black flex items-center bg-primary-yellow gap-x-2 cursor-pointer hover:opacity-80"
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
          {isLoading && <p className="font-extrabold text-sm">Loading...</p>}
          {!isLoading && <p className="font-extrabold text-sm">Add Task</p>}
        </button>
      </div>
    </Paper>
  );
}

export default TaskEditor;
