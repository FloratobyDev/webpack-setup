import React, { forwardRef, RefObject, useEffect, useState } from "react";
import { ChecklistType } from "@client/types";
import { map } from "lodash";
import Paper from "@client/components/layout/Paper";
import RadioButton from "@client/components/buttons/RadioButton";
import RotatedCross from "@client/components/svgs/RotatedCross";
import classNames from "classnames";
import ChecklistItem from "./ChecklistItem";

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

  console.log("currentChecklist", currentChecklist);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && currentChecklist !== "") {
        console.log("hello");
        onAddCheck(currentChecklist);
        setCurrentChecklist("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentChecklist]);

  const [hover, setHover] = useState(false);

  const divClass = classNames(
    "flex items-center justify-between w-full rounded-md p-1 px-2",
    {
      "bg-primary-yellow": hover,
    },
  );

  function handleRemove(idx: number) {
    const newChecklist = [...checklist];
    newChecklist.splice(idx, 1);
    setChecklist(newChecklist);
  }

  return (
    <Paper
      classname="flex justify-between flex-col gap-y-2 items-start bg-primary-black rounded-md w-full top-32 z-10"
      ref={checkListRef}
    >
      <div className="w-full">
        {map(checklist, (checklistItem, idx) => (
          <ChecklistItem
            checklistItem={checklistItem}
            key={checklistItem.id}
            onRemove={() => {
              handleRemove(idx);
            }}
          />
        ))}
      </div>
      <div className="w-full bg-black-75 p-2 rounded-md">
        <input
          alt="checklist"
          className="bg-transparent outline-none text-white placeholder:text-sm placeholder:font-jost flex w-full"
          onChange={(e) => setCurrentChecklist(e.target.value)}
          placeholder="Write checklist here..."
          value={currentChecklist}
        />
      </div>
      {/* <button
        className=""
        onClick={() => {
          if (currentChecklist === "") return;
          onAddCheck(currentChecklist);
          setCurrentChecklist("");
        }}
      >
        Add
      </button> */}
    </Paper>
  );
}

export default forwardRef(ChecklistDropdown);
