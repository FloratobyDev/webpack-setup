import { ChecklistType, DifficultyTypes, TaskType } from "@client/types";
import { debounce, filter, map, size } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import ProgressDropdown from "./ProgressDropdown";
import RadioButton from "@client/components/buttons/RadioButton";
import useOutsideClick from "@client/hooks/useOutsideClick";
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
    <div className="flex items-center gap-x-2 py-1">
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
  const [open, setOpen] = useState(false);
  const [openProgress, setOpenProgress] = useState(false);
  const { onUpdateChecklist } = useTask();
  const [mutateChecklist, { isLoading, data, isSuccess, isError, error }] =
    useUpdateChecklistMutation();
  const progressRef = useRef<HTMLDivElement>(null);

  function handleOpen() {
    setOpen(!open);
  }

  useEffect(() => {
    if (isError) {
      onUpdateChecklist(taskInfo.id, data?.id, !data?.is_done);
    }
  }, [isSuccess]);

  useOutsideClick(progressRef, openProgress, () => {
    setOpenProgress(false);
  });

  const checklistDone = useMemo(() => {
    return filter(taskInfo.checklists, { is_done: true }).length;
  }, [taskInfo.checklists]);

  const debouncedMutateChecklist = useCallback(
    debounce((taskId, checklistId, isDone) => {
      mutateChecklist({ taskId, checklistId, isDone });
    }, 200),
    [],
  );

  function handleOpenProgress(e: any) {
    e.stopPropagation();
    setOpenProgress(!openProgress);
  }

  const difficultyClass = classNames("h-2 w-2 rounded-full", {
    "bg-green-400": taskInfo.difficulty === DifficultyTypes.EASY,
    "bg-red-400": taskInfo.difficulty === DifficultyTypes.HARD,
    "bg-yellow-400": taskInfo.difficulty === DifficultyTypes.MEDIUM,
  });

  if (!taskInfo) {
    return null;
  }

  const donePercentage =
    (size(filter(taskInfo.checklists, { is_done: true })) /
      taskInfo.checklists.length) *
    100;

  const taskClass = classNames(
    "flex items-center justify-between p-2 px-3 relative text-lg gap-x-1.5",
    {
      "cursor-pointer": taskInfo.checklists.length > 0,
    },
  );

  return (
    <div
      className="rounded-md bg-primary-black select-none transition-all duration-500 ease-in-out"
      data-testid={taskInfo.id}
    >
      <div className="overflow-hidden rounded-t-md">
        <div
          className="h-1 bg-primary-yellow transition-all duration-500 ease-in-out"
          style={{
            width: `${donePercentage}%`,
            visibility: !donePercentage ? "hidden" : "visible",
          }}
        />
      </div>
      <div className={taskClass} onClick={handleOpen}>
        <p className="text-sm font-normal leading-snug">{taskInfo.title}</p>
        <div className="flex items-center gap-x-2 justify-between">
          <p className="text-[13px] text-primary-yellow font-extrabold">
            {checklistDone}/{size(taskInfo.checklists)}
          </p>
          <div className="relative" ref={progressRef}>
            <button
              className="uppercase py-1 px-3 font-medium text-paragraph cursor-pointer rounded-md hover:bg-black-75 whitespace-nowrap text-[13px]"
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
          {/* <hr className="border-y-1 border-t-black-75" /> */}
          <div className="py-2 px-4 border-y border-black-75">
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
      <div className="px-3 py-2 text-sm text-sub-paragraph italic flex items-center gap-x-2 justify-between">
        <div>
          <span className={difficultyClass} />
          {taskInfo?.due_date && (
            <p>Due date: {dayjs(taskInfo.due_date).format("MM/DD/YYYY")}</p>
          )}
          {!taskInfo?.due_date && <p>Due date: N/A</p>}
        </div>
        <p className="text-xs text-sub-paragraph">#{taskInfo.id}</p>
      </div>
    </div>
  );
}

export default Task;
