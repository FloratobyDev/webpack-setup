import React, { useRef, useState } from "react";
import CommitDropdown from "./CommitDropdown";

function JournalEditor() {
  const [title, setTitle] = useState("");

  const [text, setText] = useState("");
  const textAreaRef = useRef(null);

  function handleTextChange(event: any) {
    setText(event.target.value);
    resetTextAreaHeight();
  }

  function resetTextAreaHeight() {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }

  return (
    <div className="flex flex-col gap-y-8 text-black">
      <div className="flex flex-col gap-y-2">
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        <textarea
          onChange={handleTextChange}
          placeholder="Type something..."
          ref={textAreaRef}
          style={{ height: "auto", overflow: "hidden" }}
          value={text}
        />
      </div>
      <div className="flex gap-x-2">
        {/* <DropdownButton alignment="right" name="Add Tasks">
          <div className="text-white">
            <p>hello000oooooooooooooooo0</p>
            <p>hello</p>
            <p>hello</p>
          </div>
        </DropdownButton> */}
        <CommitDropdown />
        {/* <DropdownButton alignment="center" name="Add Commits">
          <p>hello000oooooooooooooooo0</p>
          <p>hello</p>
          <p>hello</p>
        </DropdownButton> */}
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Save Draft
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Save
        </button>
      </div>
    </div>
  );
}

export default JournalEditor;
