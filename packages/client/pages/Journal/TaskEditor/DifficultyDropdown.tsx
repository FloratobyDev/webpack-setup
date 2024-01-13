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
      className="flex justify-between flex-col items-start absolute h-24 bg-black w-full top-32"
      ref={difficultyRef}
    >
      {map(DifficultyTypes, (type) => (
        <button
          className="flex items-center gap-x-2"
          onClick={onDifficultyClick(type)}
        >
          <p>{type}</p>
        </button>
      ))}
    </div>
  );
}

export default forwardRef(DifficultyDropdown);
