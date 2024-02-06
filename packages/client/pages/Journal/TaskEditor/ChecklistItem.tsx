import React, { useState } from "react";
import { ChecklistType } from "@client/types";
import classNames from "classnames";
import RotatedCross from "@client/components/svgs/RotatedCross";

type Props = {
  checklistItem: ChecklistType;
  onRemove: (id: string) => void;
};

function ChecklistItem({ checklistItem, onRemove }: Props) {
  const [hover, setHover] = useState(false);

  const divClass = classNames(
    "flex items-center justify-between w-full rounded-smd p-1 px-2 cursor-pointer",
    {
      "bg-black-75": hover,
    },
  );

  return (
    <div
      className={divClass}
      key={checklistItem.id}
      onBlur={() => setHover(false)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onMouseOver={() => setHover(true)}
    >
      <p className="text-white">{checklistItem.content}</p>
      <div
        className="cursor-pointer"
        onClick={() => {
          onRemove(checklistItem.id);
        }}
      >
        <RotatedCross black />
      </div>
    </div>
  );
}

export default ChecklistItem;
