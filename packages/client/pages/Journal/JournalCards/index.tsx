import { BookmarkType, JournalType } from "@client/types";
import React, { useState } from "react";

type Props = {
  bookmarks: BookmarkType[];
  journals: JournalType[];
};

function JournalCards({ bookmarks, journals }: Props) {
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openJournal, setOpenJournal] = useState(true);
  return (
    <div>
      <div>
        <button onClick={() => setOpenBookmark(!openBookmark)}>
          Bookmarks
        </button>
        {openBookmark && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {bookmarks.map((bookmark) => (
              <div>
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
              <p>{journal.title}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalCards;
