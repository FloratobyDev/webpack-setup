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
        task.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search, tasks],
  );

  return (
    <DropdownButton
      alignment="left"
      name="Add Tasks"
      onCancel={onCancel}
      onOpen={onOpen}
      onSave={() => {
        onSave(stagedTasks);
        setStagedTasks([]);
      }}
    >
      <div className="flex gap-x-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-x-2">
            <SearchBar onChange={handleSearchChange} search={search} />
            <div
              className="px-4 rounded-lg flex items-center justify-center bg-black-75"
              onClick={handleOpenStagedCommitPanel}
            >
              <Hamburger />
            </div>
          </div>
          <div className="flex flex-col gap-y-2 text-white">
            {modifiedTasksBySearch.map((task) => {
              const isTaskStaged = stagedTasks.includes(task);

              const taskClasses = classNames(
                "flex justify-between items-center gap-x-2 px-2 py-1 rounded-md font-poppins font-normal text-sm",
                {
                  "text-white bg-black-75": !isTaskStaged,
                  "text-black bg-primary-yellow": isTaskStaged,
                }
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
                        stagedTasks.filter((stagedTask) => stagedTask !== task)
                      );
                    } else {
                      setStagedTasks([...stagedTasks, task]);
                    }
                  }}
                >
                  <p>{task.title}</p>
                  <div className={crossClass}>
                    <Cross />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DropdownButton>
  );
}

export default TaskDropdown;
