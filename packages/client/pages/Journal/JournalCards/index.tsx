import { ActivityValues, JournalType } from "@client/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@client/store";
import { generateRandomString } from "@client/utils";
import { H1 } from "@client/components/headings";
import HeaderTabs from "@client/components/HeaderTabs";
import { filter, map } from "lodash";
import Paper from "@client/components/layout/Paper";
import SearchBar from "@client/components/searchbar/SearchBar";
import { useRepository } from "@client/contexts/RepositoryContext";
import Modal from "@client/components/layout/Modal";
import HoverDropdown from "./HoverDropdown";

function JournalCards() {
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openJournal, setOpenJournal] = useState(true);
  const { bookmarks, setBookmarks, currentRepository, journals } =
    useRepository();

  const [
    addBookmark,
    { data: bookmarkData, isLoading: bookmarkLoading, error: bookmarkError },
  ] = useAddBookmarkMutation();

  const [
    removeBookmark,
    {
      data: removeBookmarkData,
      isLoading: removeBookmarkLoading,
      error: removeBookmarkError,
    },
  ] = useRemoveBookmarkMutation();

  function handleAddBookmark(newBookmark: JournalType) {
    if (bookmarks.some((bookmark) => bookmark.id === newBookmark.id)) {
      removeBookmark(newBookmark.id);
      const removeBookmarkFilter = bookmarks.filter(
        (bookmark) => bookmark.id !== newBookmark.id,
      );
      setBookmarks(removeBookmarkFilter);
    } else {
      addBookmark({
        journalId: newBookmark.id,
        repoId: Number(currentRepository.id),
      });
      setBookmarks([...bookmarks, newBookmark]);
    }
  }

  const [currentSearch, setCurrentSearch] = useState("");

  const handleInputChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };

  const [activeTab, setActiveTab] = useState(ActivityValues.JOURNAL);
  const mappedProgressValues = map(ActivityValues, (tab) => tab);
  const [activeValues, setActiveValues] = useState([]);
  const [currentJournal, setCurrentJournal] = useState<JournalType | null>(
    null,
  );

  function getActiveValues() {
    if (activeTab === ActivityValues.BOOKMARK) {
      return bookmarks;
    }
    return journals;
  }

  useEffect(() => {
    setActiveValues(getActiveValues());
  }, [activeTab, bookmarks, journals]);

  const modifiedActiveValues: JournalType[] = useMemo(() => {
    let journalPlaceholder = [];

    if (currentSearch) {
      journalPlaceholder = activeValues.filter((task: JournalType) => {
        return task.title.toLowerCase().includes(currentSearch.toLowerCase());
      });

      return journalPlaceholder;
    }
    return activeValues;
  }, [currentSearch, activeTab, activeValues]);

  const [openModal, setOpenModal] = useState(false);

  console.log("modif", modifiedActiveValues);

  return (
    <>
      <Modal isOpen={openModal}>
        {openModal && (
          <div className="text-white">
            {currentJournal.title}
            <p>{currentJournal.content}</p>
            <button onClick={() => setOpenModal(false)}>Close</button>
          </div>
        )}
      </Modal>
      <Paper>
        <H1>Recent Activities</H1>
        <div className="flex justify-between">
          <HeaderTabs<string>
            activeValues={activeTab}
            handleValueChange={setActiveTab}
            invertColor
            options={mappedProgressValues}
          />
          <div className=" basis-52">
            <SearchBar onChange={handleInputChange} search={currentSearch} />
          </div>
        </div>
        <div>
          <div className="flex w-full gap-y-2 flex-col">
            {modifiedActiveValues.map((value) => (
              <div
                className="flex justify-between px-2"
                key={generateRandomString(5)}
                onClick={() => {
                  setOpenModal(true);
                  setCurrentJournal(value);
                }}
              >
                <div className="flex items-center">
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      console.log("hi");

                      handleAddBookmark(value);
                    }}
                  >
                    <svg
                      fill="none"
                      height="14"
                      viewBox="0 0 14 14"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.80768 1.01186C6.95735 0.551208 7.60906 0.55121 7.75873 1.01187L8.96706 4.73071C9.034 4.93672 9.22597 5.0762 9.44259 5.0762H13.3528C13.8372 5.0762 14.0386 5.69601 13.6467 5.98071L10.4833 8.27909C10.308 8.40641 10.2347 8.63209 10.3016 8.8381L11.51 12.5569C11.6596 13.0176 11.1324 13.4007 10.7405 13.116L7.5771 10.8176C7.40185 10.6903 7.16455 10.6903 6.98931 10.8176L3.82587 13.116C3.43401 13.4007 2.90677 13.0176 3.05645 12.5569L4.26478 8.8381C4.33171 8.63209 4.25838 8.40641 4.08314 8.27909L0.919699 5.98071C0.527842 5.69601 0.729231 5.0762 1.21359 5.0762H5.12382C5.34043 5.0762 5.53241 4.93672 5.59935 4.73071L6.80768 1.01186Z"
                        fill="#DFB626"
                      />
                    </svg>
                  </button>
                  <p>{value.title}</p>
                </div>
                <div className="flex">
                  <div className="flex">
                    {value.commits?.length > 0 && (
                      <HoverDropdown label="Commits">
                        <div className="absolute bg-gray-200">
                          {value.commits.map((commit) => (
                            <p key={commit.commit_sha}>{commit.commit_sha}</p>
                          ))}
                        </div>
                      </HoverDropdown>
                    )}
                    {value.tasks?.length > 0 && (
                      <HoverDropdown label="Tasks">
                        <div className="absolute bg-gray-200">
                          {value.tasks.map((task) => (
                            <p key={task.id}>{task.title}</p>
                          ))}
                        </div>
                      </HoverDropdown>
                    )}
                  </div>
                  <p>{value.created_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </>
  );
}

export default JournalCards;
