import React, { forwardRef, RefObject } from "react";
import { DifficultyTypes } from "@client/types";
import { map } from "lodash";

type Props = {
  onDifficultyClick: (difficultyType: string) => () => void;
};

function DifficultyDropdown(
  { onDifficultyClick }: Props,
  difficultyRef: RefObject<HTMLDivElement>
) {
  return (
    <div
      className="flex justify-between flex-col items-start absolute z-10 h-24 bg-primary-black w-full p-1 top-10 rounded-smd border border-primary-outline"
      ref={difficultyRef}
    >
      {map(DifficultyTypes, (type) => (
        <button
          className="flex items-center gap-x-2 hover:bg-black-75 w-full px-2 rounded-smd capitalize"
          key={type}
          onClick={onDifficultyClick(type)}
        >
          <p>{type}</p>
        </button>
      ))}
    </div>
  );
}

export default forwardRef(DifficultyDropdown);
