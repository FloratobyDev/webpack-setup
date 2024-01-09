import WidgetCard from "@client/components/cards/WidgetCard";
import React, { useEffect, useState } from "react";

function JournalCards() {
  const [openBookmark, setOpenBookmark] = useState(true);
  const [openJournal, setOpenJournal] = useState(true);
  const [bookmarks, setBookmarks] = useState([
    { title: "Google", url: "https://www.google.com" },
    { title: "GitHub", url: "https://www.github.com" },
    { title: "Stack Overflow", url: "https://stackoverflow.com" },
    { title: "Medium", url: "https://medium.com" },
    { title: "Stackjk Overflow", url: "https://stackoverflow.com" },
    { title: "Medikjum", url: "https://medium.com" },
  ]);
  const [journals, setJournals] = useState([
    {
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      title: "Journal 1",
    },
    {
      content: "Nulla facilisi. Sed euismod, nunc id aliquam ultrices.",
      title: "Journal 2",
    },
    {
      content:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
      title: "Journal 3",
    },
    {
      content:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      title: "Journal 4",
    },
  ]);

  return (
    <div>
      <div>
        <button onClick={() => setOpenBookmark(!openBookmark)}>
          Bookmarks
        </button>
        {openBookmark && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {bookmarks.map((bookmark) => (
              <WidgetCard
                description={bookmark.url}
                onClick={() => {}}
                title={bookmark.title}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => setOpenJournal(!openJournal)}>Journals</button>
        {openJournal && (
          <div className="grid grid-cols-4 gap-2 w-full">
            {journals.map((journal) => (
              <WidgetCard
                description={journal.content}
                onClick={() => {}}
                title={journal.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalCards;
