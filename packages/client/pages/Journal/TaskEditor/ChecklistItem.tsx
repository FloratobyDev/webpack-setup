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
    "flex items-center justify-between w-full rounded-md p-1 px-2 cursor-pointer",
    {
      "bg-primary-yellow": hover,
    },
  );

  const pClass = classNames("font-jost text-md", {
    "text-black": hover,
    "text-white": !hover,
  });

  return (
    <div
      className={divClass}
      key={checklistItem.id}
      onBlur={() => setHover(false)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onMouseOver={() => setHover(true)}
    >
      <p className={pClass}>{checklistItem.content}</p>
      <div
        className="cursor-pointer"
        onClick={() => {
          onRemove(checklistItem.id);
        }}
      >
        <RotatedCross black={!hover} />
      </div>
    </div>
  );
}

export default ChecklistItem;
