import { ActivityValues, JournalType } from "@client/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@client/store";
import { generateRandomString } from "@client/utils";
import { H2 } from "@client/components/headings";
import HeaderTabs from "@client/components/HeaderTabs";
import JournalItem from "./JournalItem";
import { map } from "lodash";
import Modal from "@client/components/layout/Modal";
import Paper from "@client/components/layout/Paper";
import SearchBar from "@client/components/searchbar/SearchBar";
import { useRepository } from "@client/contexts/RepositoryContext";

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
      <Paper classname="flex flex-col gap-y-3">
        <H2 classname="font-extrabold text-primary-yellow">
          Recent Activities
        </H2>
        <div className="flex justify-between">
          <HeaderTabs<string>
            activeValues={activeTab}
            handleValueChange={setActiveTab}
            invertColor
            options={mappedProgressValues}
          />
          <div className="basis-52">
            <SearchBar
              className="h-full"
              invert
              onChange={handleInputChange}
              search={currentSearch}
              show
            />
          </div>
        </div>
        <div>
          <div className="flex w-full flex-col">
            {modifiedActiveValues.map((value) => (
              <JournalItem
                handleAddBookmark={handleAddBookmark}
                key={generateRandomString(5)}
                setCurrentJournal={setCurrentJournal}
                setOpenModal={setOpenModal}
                value={value}
              />
            ))}
          </div>
        </div>
      </Paper>
    </>
  );
}

export default JournalCards;
