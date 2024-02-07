/* eslint-disable react/jsx-curly-brace-presence */
import { ActivityValues, JournalType } from "@client/types";
import { H2, H1 } from "@client/components/headings";
import React, { useEffect, useMemo, useState } from "react";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@client/store";
import { generateRandomString } from "@client/utils";
import HeaderTabs from "@client/components/HeaderTabs";
import JournalItem from "./JournalItem";
import { map } from "lodash";
import Markdown from "react-markdown";
import Modal from "@client/components/layout/Modal";
import Paper from "@client/components/layout/Paper";
import remarkGfm from "remark-gfm";
import RotatedCross from "@client/components/svgs/RotatedCross";
import SearchBar from "@client/components/searchbar/SearchBar";
import { useRepository } from "@client/contexts/RepositoryContext";
import dayjs from "dayjs";
import JournalViewer from "./JournalViewer";

function JournalCards() {
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openJournal, setOpenJournal] = useState(true);
  const { bookmarks, setBookmarks, currentRepository, journals, setJournals } =
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

  const [currentSearch, setCurrentSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState(ActivityValues.JOURNAL);
  const mappedProgressValues = map(ActivityValues, (tab) => tab);
  const [activeValues, setActiveValues] = useState([]);
  const [currentJournal, setCurrentJournal] = useState<JournalType | null>(
    null,
  );

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

  const handleInputChange = (e: any) => {
    setCurrentSearch(e.target.value);
  };

  function handleAddBookmark(newBookmark: JournalType) {
    if (bookmarks.some((bookmark) => bookmark.id === newBookmark.id)) {
      removeBookmark(newBookmark.id);
      const removeBookmarkFilter = bookmarks.filter(
        (bookmark) => bookmark.id !== newBookmark.id,
      );
      setJournals(
        journals.map((journal) => {
          if (journal.id === newBookmark.id) {
            return { ...journal, is_bookmarked: false };
          }
          return journal;
        }),
      );
      setBookmarks(removeBookmarkFilter);
    } else {
      addBookmark({
        journalId: newBookmark.id,
        repoId: Number(currentRepository.id),
      });

      setJournals(
        journals.map((journal) => {
          if (journal.id === newBookmark.id) {
            return { ...journal, is_bookmarked: true };
          }
          return journal;
        }),
      );

      const modBookmark = { ...newBookmark, is_bookmarked: true };
      setBookmarks([...bookmarks, modBookmark]);
    }
  }

  function getActiveValues() {
    if (activeTab === ActivityValues.BOOKMARK) {
      return bookmarks;
    }
    return journals;
  }

  useEffect(() => {
    setActiveValues(getActiveValues());
  }, [activeTab, bookmarks, journals]);

  return (
    <>
      <JournalViewer
        journal={currentJournal}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
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
