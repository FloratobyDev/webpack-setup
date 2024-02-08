import React, { useEffect, useState } from "react";
import { CommitType } from "@client/types";
import DropdownButton from "@client/components/buttons/DropdownButton";
import { H6 } from "@client/components/headings";
import { map } from "lodash";
import PushInfo from "./PushInfo";
import SearchBar from "@client/components/searchbar/SearchBar";
import { useRepository } from "@client/contexts/RepositoryContext";

type Props = {
  commits: CommitType[];
  onSave: (commits: CommitType[]) => void;
};

function CommitDropdown({ commits, onSave }: Props) {
  const [search, setSearch] = useState<string>("");
  const [openStagedCommitPanel, setOpenStagedCommitPanel] = useState(true);
  const [selectedStagedCommits, setSelectedStagedCommits] =
    useState<CommitType[]>(commits);
  const { pushList, setPushList } = useRepository();

  function handleMultipleSelect(commit: CommitType[]) {
    setSelectedStagedCommits([...selectedStagedCommits, ...commit]);
  }

  function handleSingleSelect(commit: CommitType) {
    setSelectedStagedCommits([...selectedStagedCommits, commit]);
  }

  function handleSingleDeselect(commit: CommitType) {
    setSelectedStagedCommits(
      selectedStagedCommits.filter((c) => c.commit_sha !== commit.commit_sha),
    );
  }

  function handleMultipleDeselect(removedCommits: CommitType[]) {
    setSelectedStagedCommits((prevCommits) => {
      const removedCommitShas = map(removedCommits, (c) => c.commit_sha);
      return prevCommits.filter(
        (c) => !removedCommitShas.includes(c.commit_sha),
      );
    });
  }

  function handleOpenStagedCommitPanel() {
    setOpenStagedCommitPanel(!openStagedCommitPanel);
  }

  function handleSearchChange(event: any) {
    setSearch(event.target.value);
  }

  function onCancel() {
    setSelectedStagedCommits([]);
  }

  function onOpen() {
    setSelectedStagedCommits(commits);
  }

  const hasInteracted = pushList.some((push) => !push.has_interacted);

  const label = `Add Commits (${commits.length})`;
  
  return (
    <DropdownButton
      alignment="left"
      hasAlerts={hasInteracted}
      name={label}
      onCancel={onCancel}
      onOpen={onOpen}
      onSave={() => {
        onSave(selectedStagedCommits);
        setSelectedStagedCommits([]);
      }}
    >
      <div className="text-paragraph pb-2 w-full">
        <div className="flex gap-x-2 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-x-2">
              <SearchBar
                className="h-8"
                invert
                onChange={handleSearchChange}
                search={search}
                show
              />
              <div
                className="px-4 rounded-smd flex items-center justify-center bg-black-75 cursor-pointer"
                onClick={handleOpenStagedCommitPanel}
              >
                <svg
                  fill="none"
                  height="10"
                  viewBox="0 0 11 10"
                  width="11"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.419922 0.579102V1.8291H10.4199V0.579102H0.419922ZM0.419922 4.2916V5.5416H10.4199V4.2916H0.419922ZM0.419922 8.0416V9.2916H10.4199V8.0416H0.419922Z"
                    fill="#F0F0F0"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-y-1 h-72 w-full overflow-y-auto overflow-x-hidden">
              {map(pushList, (push, key) => (
                <PushInfo
                  key={key}
                  onDeselect={handleSingleDeselect}
                  onDeselectMultiple={handleMultipleDeselect}
                  onSelect={handleSingleSelect}
                  onSelectMultiple={handleMultipleSelect}
                  pushInfo={push}
                  selectedCommits={selectedStagedCommits}
                  setPushList={setPushList}
                />
              ))}
              {pushList.length === 0 && (
                <p className="text-center whitespace-nowrap italic text-sub-paragraph text-sm">No push available</p>
              )}
            </div>
          </div>
          {openStagedCommitPanel && (
            <div className="flex flex-col gap-y-2 p-2">
              <H6>Commits</H6>
              <div className="flex flex-col gap-y-0.5">
                {selectedStagedCommits.length > 0 ? (
                  map(selectedStagedCommits, (commit) => (
                    <div
                      className="flex justify-between px-2 py-1 rounded-smd bg-black-75 gap-x-2 text-sm"
                      key={commit.commit_sha}
                    >
                      <p className="truncate w-32">{commit.description}</p>
                      <div className="flex gap-x-2">
                        <p className="">{commit.commit_sha.substring(0,5)}</p>
                        <button onClick={() => handleSingleDeselect(commit)}>
                          -
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sub-paragraph text-sm italic whitespace-nowrap">
                    No commits selected
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DropdownButton>
  );
}

export default CommitDropdown;
