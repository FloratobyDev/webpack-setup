import React, { useMemo, useState } from "react";
import classNames from "classnames";
import Cross from "@client/components/svgs/Cross";
import DropdownButton from "@client/components/buttons/DropdownButton";
import Hamburger from "@client/components/svgs/Hamburger";
import RotatedCross from "@client/components/svgs/RotatedCross";
import SearchBar from "@client/components/searchbar/SearchBar";
import { TaskType } from "@client/types";
import { useRepository } from "@client/contexts/RepositoryContext";

type Props = {
  selectedTasks: TaskType[];
  onSave: (stagedTasks: TaskType[]) => void;
};

function TaskDropdown({ selectedTasks, onSave }: Props) {
  const [search, setSearch] = useState<string>("");
  const [openStagedCommitPanel, setOpenStagedCommitPanel] = useState(true);
  const [stagedTasks, setStagedTasks] = useState<TaskType[]>([]); // ["commit1", "commit2"
  const { tasks } = useRepository();

  function onCancel() {
    setStagedTasks([]);
  }

  function onOpen() {
    setStagedTasks(selectedTasks);
  }

  function handleSearchChange(event: any) {
    setSearch(event.target.value);
  }

  function handleOpenStagedCommitPanel() {
    setOpenStagedCommitPanel(!openStagedCommitPanel);
  }

  const modifiedTasksBySearch = useMemo(
    () =>
      tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, tasks],
  );

  const label = `Add Tasks (${selectedTasks.length})`;

  return (
    <DropdownButton
      alignment="left"
      name={label}
      onCancel={onCancel}
      onOpen={onOpen}
      onSave={() => {
        onSave(stagedTasks);
        setStagedTasks([]);
      }}
    >
      <div className="flex gap-x-2 min-w-72 pb-2 h-full">
        <div className="flex flex-col gap-2 w-full h-full">
          <SearchBar
            className="h-10"
            invert
            onChange={handleSearchChange}
            search={search}
            show
          />
          <div className="flex flex-col gap-y-1 text-white w-full border-t border-primary-outline py-2 h-72">
            <p className="text-paragraph text-sm indent-1 font-extrabold">
              Tasks
            </p>
            <div className="overflow-auto flex flex-col gap-y-1 h-full">
              {modifiedTasksBySearch.length === 0 && (
                <p className="text-sub-paragraph text-sm indent-1 italic">No tasks found</p>
              )}
              {modifiedTasksBySearch.map((task) => {
                const isTaskStaged = stagedTasks.includes(task);

                const taskClasses = classNames(
                  "flex justify-between items-center gap-x-2 px-3 py-1.5 rounded-md font-medium text-sm w-full cursor-pointer",
                  {
                    "text-paragraph bg-black-75": !isTaskStaged,
                    "text-primary-black bg-paragraph": isTaskStaged,
                  },
                );

                const crossClass = classNames("transition-all duration-300", {
                  "rotate-45": isTaskStaged,
                  "rotate-0": !isTaskStaged,
                });

                return (
                  <div
                    className={taskClasses}
                    key={`task-${task.id}`}
                    onClick={() => {
                      if (isTaskStaged) {
                        setStagedTasks(
                          stagedTasks.filter((stagedTask) => stagedTask !== task),
                        );
                      } else {
                        setStagedTasks([...stagedTasks, task]);
                      }
                    }}
                  >
                    <p>{task.title}</p>
                    <div className={crossClass}>
                      <Cross black={isTaskStaged} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DropdownButton>
  );
}

export default TaskDropdown;
