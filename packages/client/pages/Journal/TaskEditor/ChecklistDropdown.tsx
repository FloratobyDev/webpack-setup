import React, { forwardRef, RefObject } from "react";
import { ChecklistType } from "@client/types";
import { map } from "lodash";

type Props = {
  checklist: ChecklistType[];
  setChecklist: (checklist: ChecklistType[]) => void;
  currentChecklist: string;
  setCurrentChecklist: (currentChecklist: string) => void;
  onAddCheck: () => void;
};

function ChecklistDropdown(
  {
    checklist,
    setChecklist,
    currentChecklist,
    setCurrentChecklist,
    onAddCheck,
  }: Props,
  checkListRef: RefObject<HTMLDivElement>,
) {
  return (
    <div
      className="flex justify-between flex-col items-start absolute bg-black w-full top-32 z-10"
      ref={checkListRef}
    >
      <input
        className="grow border border-gray-300 w-full rounded-lg focus:outline-none focus:border-blue-500"
        onChange={(e) => setCurrentChecklist(e.target.value)}
        placeholder="Write task here..."
        value={currentChecklist}
      />
      <div>
        {map(checklist, (task, idx) => (
          <div className="flex items-center gap-x-2">
            <p>{task.description}</p>
            <button
              className=""
              onClick={() => {
                const newChecklist = [...checklist];
                newChecklist.splice(idx, 1);
                setChecklist(newChecklist);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button className="" onClick={onAddCheck}>
        Add
      </button>
    </div>
  );
}

export default forwardRef(ChecklistDropdown);
