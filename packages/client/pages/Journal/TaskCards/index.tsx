import { DifficultyTypes, ProgressValues, TaskType } from "@client/types";
import { filter, map } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import HeaderTabs from "@client/components/HeaderTabs";
import Paper from "@client/components/layout/Paper";
import SearchBar from "@client/components/searchbar/SearchBar";
import Task from "./Task";
import { useTask } from "@client/contexts/TaskContext";

function TaskCards() {
  const [activeTab, setActiveTab] = useState(ProgressValues.OPEN);
  const { tasks } = useTask();
  const [currentSearch, setCurrentSearch] = useState("");

  const handleInputChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };

  const modifiedTasks = useMemo(() => {
    let tasksPlaceholder = filter(tasks, (task: TaskType) => {
      return task.state === activeTab;
    });

    if (currentSearch) {
      tasksPlaceholder = tasksPlaceholder.filter((task: TaskType) => {
        return task.title.toLowerCase().includes(currentSearch.toLowerCase());
      });
    }

    const sortTasks = (tasksTobeSorted: TaskType[]) => {
      const order = {
        [DifficultyTypes.EASY]: 1,
        [DifficultyTypes.MEDIUM]: 2,
        [DifficultyTypes.HARD]: 3,
      };

      return tasksTobeSorted.sort((a, b) => {
        return order[a.difficulty] - order[b.difficulty];
      });
    };

    const sortedTasks = sortTasks(tasksPlaceholder);
    return sortedTasks;
  }, [tasks, currentSearch, activeTab]);

  const mappedProgressValues = map(ProgressValues, (tab) => tab);

  return (
    <Paper classname="flex h-full flex-col gap-y-3">
      <SearchBar
        className="h-10"
        onChange={handleInputChange}
        search={currentSearch}
        show
      />
      <HeaderTabs<string>
        activeValues={activeTab}
        handleValueChange={setActiveTab}
        options={mappedProgressValues}
      />
      <div className="overflow-auto flex flex-col gap-y-2 h-full">
        {map(modifiedTasks, (task) => {
          return <Task key={task.id} taskInfo={task} />;
        })}
      </div>
    </Paper>
  );
}

export default TaskCards;
