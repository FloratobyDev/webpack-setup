import { DifficultyTypes, ProgressValues, TaskType } from "@client/types";
import { filter, map } from "lodash";
import React, { useMemo, useState } from "react";
import HeaderTabs from "@client/components/HeaderTabs";
import SearchBar from "@client/components/searchbar/SearchBar";
import Task from "./Task";
import { useTask } from "@client/contexts/TaskContext";

function TaskCards() {
  const [activeTab, setActiveTab] = useState(ProgressValues.INPROGRESS);
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

  // const progressValues =

  const mappedProgressValues = map(ProgressValues, (tab) => tab);

  return (
    <div className="flex h-full flex-col relative gap-y-4">
      <SearchBar onChange={handleInputChange} search={currentSearch} />
      <HeaderTabs<string>
        activeValues={activeTab}
        handleValueChange={setActiveTab}
        options={mappedProgressValues}
      />
      <div className="overflow-auto h-full gap-y-2">
        {map(modifiedTasks, (task) => {
          return <Task key={task.id} taskInfo={task} />;
        })}
      </div>
    </div>
  );
}

export default TaskCards;
