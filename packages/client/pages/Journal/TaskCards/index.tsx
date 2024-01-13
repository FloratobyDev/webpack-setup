import { ProgressType, TaskType } from "@client/types";
import React, { useMemo, useState } from "react";
import classNames from "classnames";
import { map } from "lodash";
import Task from "./Task";
import { useTask } from "@client/contexts/TaskContext";

function TaskCards() {
  const [activeTab, setActiveTab] = useState(ProgressType.OPEN);
  const { tasks, onUpdateTask } = useTask();
  const [currentSearch, setCurrentSearch] = useState("");
  const [sortBy, setSortBy] = useState("difficlty"); // ["state", "difficulty"

  const handleInputChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };

  const modifiedTasks = useMemo(() => {
    if (!currentSearch) return tasks;
    const filteredTasks = tasks.filter((task: TaskType) => {
      return (
        task.progress === activeTab &&
        task.name.toLowerCase().includes(currentSearch.toLowerCase())
      );
    });

    return filteredTasks;
  }, [tasks, currentSearch, sortBy]);

  return (
    <div className="flex h-full flex-col relative gap-y-4">
      <div className="flex justify-between gap-x-2">
        <div className="flex justify-between bg-gray-500 flex-1 items-center px-2 gap-x-2">
          <input
            className="flex-1 text-black"
            onChange={handleInputChange}
            type="text"
            value={currentSearch}
          />
          <p>search</p>
        </div>
        <div>
          <p className="whitespace-nowrap">Sort by state</p>
        </div>
      </div>
      <div className="flex items-center">
        {map(ProgressType, (tab) => {
          const buttonClass = classNames(
            "flex-1 p-1 px-3 mx-1 rounded-full grow-0 whitespace-nowrap",
            {
              "bg-black": tab === activeTab,
              "bg-gray-500": tab !== activeTab,
            }
          );
          return (
            <button
              className={buttonClass}
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="overflow-auto flex flex-col gap-y-2">
        {map(modifiedTasks, (task) => {
          if (task.progress !== activeTab) return null;
          return (
            <Task
              key={task.taskId}
              onProgressChange={onUpdateTask}
              progressTypes={ProgressType}
              taskInfo={task}
            />
          );
        })}
      </div>
    </div>
  );
}

export default TaskCards;
