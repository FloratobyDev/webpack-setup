import React, { useState } from "react";
import { generateRandomString } from "@client/utils";
import { JournalType } from "@client/types";

type Props = {
  bookmarks: JournalType[];
  setBookmarks: (bookmarks: JournalType[]) => void;
  journals: JournalType[];
};

function JournalCards({ bookmarks, setBookmarks, journals }: Props) {
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openJournal, setOpenJournal] = useState(true);

  function handleAddBookmark(newBookmark: JournalType) {
    return () => {
      if (bookmarks.includes(newBookmark)) {
        setBookmarks(bookmarks.filter((bookmark) => bookmark !== newBookmark));
      } else {
        setBookmarks([...bookmarks, newBookmark]);
      }
    };
  }

  return (
    <div>
      <div>
        <button onClick={() => setOpenBookmark(!openBookmark)}>
          Bookmarks
        </button>
        {openBookmark && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {bookmarks.map((bookmark) => (
              <div key={generateRandomString(5)}>
                <p>{bookmark.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setOpenJournal(!openJournal)}>Journals</button>
        {openJournal && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {journals.map((journal) => (
              <div
                className="flex flex-col bg-gray-300"
                key={generateRandomString(5)}
              >
                <button onClick={handleAddBookmark(journal)}>
                  Add bookmark
                </button>
                <p>{journal.title}</p>
                {journal.tasks.map((task) => (
                  <p key={generateRandomString(5)}>{task.title}</p>
                ))}
                {journal.commits.map((commit) => (
                  <p key={commit.commit_sha}>{commit.commit_sha}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalCards;
