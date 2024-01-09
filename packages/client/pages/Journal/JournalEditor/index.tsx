import React, { useRef, useState } from "react";

function JournalEditor() {
  const [title, setTitle] = useState<string>("");
  // const [content, setContent] = useState<string>("");
  // const [textAreaHeight, setTextAreaHeight] = useState("auto");

  const [text, setText] = useState("");
  const textAreaRef = useRef(null);

  const handleTextChange = (event: any) => {
    setText(event.target.value);
    resetTextAreaHeight();
  };

  const resetTextAreaHeight = () => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  };
  return (
    <div className="flex flex-col gap-y-8 text-black ">
      <div className="flex flex-col gap-y-2">
        <input
          className="border-2 border-gray-300 rounded-md p-2"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        <textarea
          ref={textAreaRef}
          style={{ height: "auto", overflow: "hidden" }}
          value={text}
          onChange={handleTextChange}
          placeholder="Type something..."
        />
      </div>
      <div>
        <button className="bg-black text-white px-4 py-2 rounded-md">
          Save
        </button>
      </div>
    </div>
  );
}

export default JournalEditor;
