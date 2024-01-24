import React, { useState } from "react";
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
  const { pushList } = useRepository();

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

  return (
    <DropdownButton
      alignment="left"
      name="Add Commits"
      onCancel={onCancel}
      onOpen={onOpen}
      onSave={() => {
        onSave(selectedStagedCommits);
        setSelectedStagedCommits([]);
      }}
    >
      <div className="text-white">
        <div className="flex gap-x-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-x-2">
              <SearchBar onChange={handleSearchChange} search={search} />
              <div
                className="px-4 rounded-lg flex items-center justify-center bg-black-75"
                onClick={handleOpenStagedCommitPanel}
              >
                <p>E</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              {map(pushList, (push, key) => (
                <PushInfo
                  key={key}
                  onDeselect={handleSingleDeselect}
                  onDeselectMultiple={handleMultipleDeselect}
                  onSelect={handleSingleSelect}
                  onSelectMultiple={handleMultipleSelect}
                  pushInfo={push}
                  selectedCommits={selectedStagedCommits}
                />
              ))}
              {pushList.length === 0 && (
                <p className="text-center">No push available</p>
              )}
            </div>
          </div>
          {openStagedCommitPanel && (
            <div className="flex flex-col gap-y-2 p-2">
              <H6>Commits</H6>
              <div>
                {selectedStagedCommits.length > 0 ? (
                  map(selectedStagedCommits, (commit) => (
                    <div
                      className="flex justify-between p-1"
                      key={commit.commit_sha}
                    >
                      <p className="truncate w-32">{commit.description}</p>
                      <div className="flex gap-x-2">
                        <p className="">{commit.commit_sha}</p>
                        <button onClick={() => handleSingleDeselect(commit)}>
                          -
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white italic">No commits selected</p>
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
