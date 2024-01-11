import React, { useState } from "react";
import { CommitType } from "@client/types";
import DropdownButton from "@client/components/buttons/DropdownButton";
import { H6 } from "@client/components/headings";
import { map } from "lodash";
import PushInfo from "./PushInfo";
import SearchBar from "@client/components/searchbar/SearchBar";
import { useRepository } from "@client/contexts/RepositoryContext";

function CommitDropdown() {
  const [search, setSearch] = useState<string>("");
  const [openSelectedCommits, setOpenSelectedCommits] = useState(true);
  const [selectedCommits, setSelectedCommits] = useState<CommitType[]>([]); // ["commit1", "commit2"
  const { pushList } = useRepository();

  function handleMultipleSelect(commit: CommitType[]) {
    setSelectedCommits([...selectedCommits, ...commit]);
  }

  function handleSingleSelect(commit: CommitType) {
    setSelectedCommits([commit]);
  }

  function handleSingleDeselect(commit: CommitType) {
    setSelectedCommits(
      selectedCommits.filter((c) => c.commit_sha !== commit.commit_sha)
    );
  }

  function handleMultipleDeselect(removedCommits: CommitType[]) {
    setSelectedCommits((prevCommits) => {
      const removedCommitShas = map(removedCommits, (c) => c.commit_sha);
      return prevCommits.filter(
        (c) => !removedCommitShas.includes(c.commit_sha)
      );
    });
  }

  function handleOpenSelectedCommits() {
    setOpenSelectedCommits(!openSelectedCommits);
  }

  function handleSearchChange(event: any) {
    setSearch(event.target.value);
  }

  return (
    <DropdownButton alignment="left" name="Add Commits">
      <div className="text-white">
        <div className="flex gap-x-2">
          <div className="flex flex-col gap-2">
            <div className="flex gap-x-2">
              <SearchBar onChange={handleSearchChange} search={search} />
              <div
                className="px-4 rounded-lg flex items-center justify-center bg-black-75"
                onClick={handleOpenSelectedCommits}
              >
                <p>E</p>
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              {map(pushList, (push) => (
                <PushInfo
                  onDeselect={handleSingleDeselect}
                  onDeselectMultiple={handleMultipleDeselect}
                  onSelect={handleSingleSelect}
                  onSelectMultiple={handleMultipleSelect}
                  pushInfo={push}
                  selectedCommits={selectedCommits}
                />
              ))}
            </div>
          </div>
          {openSelectedCommits && (
            <div className="flex flex-col gap-y-2 p-2">
              <H6>Commits</H6>
              <div>
                {selectedCommits.length > 0 ? (
                  map(selectedCommits, (commit) => (
                    <div className="flex justify-between p-1">
                      <p className="truncate w-32">{commit.message}</p>
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
