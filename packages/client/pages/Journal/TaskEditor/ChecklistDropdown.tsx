import React, { forwardRef, RefObject, useEffect, useState } from "react";
import ChecklistItem from "./ChecklistItem";
import { ChecklistType } from "@client/types";
import { map } from "lodash";

type Props = {
  checklist: ChecklistType[];
  setChecklist: (checklist: ChecklistType[]) => void;
  onAddCheck: (currentCheckList: string) => void;
};

function ChecklistDropdown(
  { checklist, setChecklist, onAddCheck }: Props,
  checkListRef: RefObject<HTMLDivElement>,
) {
  const [currentChecklist, setCurrentChecklist] = useState<string>("");

  // console.log("currentChecklist", currentChecklist);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && currentChecklist !== "") {
        onAddCheck(currentChecklist);
        setCurrentChecklist("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentChecklist]);

  function handleRemove(idx: number) {
    const newChecklist = [...checklist];
    newChecklist.splice(idx, 1);
    setChecklist(newChecklist);
  }

  return (
    <div
      className="flex justify-between flex-col gap-y-2 items-start bg-primary-black rounded-smd w-full top-32 z-10 p-2"
      ref={checkListRef}
    >
      <div className="w-full flex flex-col justify-center">
        {map(checklist, (checklistItem, idx) => (
          <ChecklistItem
            checklistItem={checklistItem}
            key={checklistItem.id}
            onRemove={() => {
              handleRemove(idx);
            }}
          />
        ))}
        {checklist.length === 0 && (
          <p className="text-sub-paragraph text-center italic text-md py-2">
            No checklist added
          </p>
        )}
      </div>
      <div className="w-full bg-black-75 px-2 py-1 rounded-smd flex justify-between items-center">
        <input
          alt="checklist"
          className="bg-transparent outline-none text-paragraph placeholder:text-md placeholder:text-paragraph focus:placeholder:text-transparent flex w-full h-4"
          onChange={(e) => setCurrentChecklist(e.target.value)}
          placeholder="Write checklist here..."
          value={currentChecklist}
        />
        <button
          className="px-2 py-1 hover:bg-primary-yellow hover:text-primary-black rounded-smd font-sem"
          onClick={() => {
            onAddCheck(currentChecklist);
            setCurrentChecklist("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default forwardRef(ChecklistDropdown);
