import React, { ReactNode, useRef, useState } from "react";
import classNames from "classnames";
import useOutsideClick from "@client/hooks/useOutsideClick";

type Alignment = "left" | "right" | "center";

type Props = {
  name: string;
  children: ReactNode;
  alignment: Alignment;
  onCancel?: () => void;
  onSave?: () => void;
  onOpen?: () => void;
  hasAlerts?: boolean;
};

function DropdownButton({
  name,
  children,
  alignment,
  onOpen,
  onCancel,
  onSave,
  hasAlerts,
}: Props) {
  const [open, toggle] = useState(false);
  const divRef = useRef(null);

  function handleOpenTask() {
    toggle(!open);
    onOpen();
  }

  useOutsideClick(divRef, open, () => {
    toggle(false);
  });

  const alignmentClasses = classNames(
    "p-2 absolute z-10 bg-black border-gray-200 mt-2 border rounded-smd flex flex-col overflow-hidden",
    {
      "left-0": alignment === "left",
      "right-0": alignment === "right",
      "left-1/2 transform -translate-x-1/2": alignment === "center",
    },
  );

  return (
    <div className="relative" ref={divRef}>
      {hasAlerts && (
        <div className="h-2 w-2 bg-red-400 -top-0.5 -right-0.5 rounded-full absolute" />
      )}
      <button
        className="border border-black-5 text-paragraph px-3 py-1.5 rounded-smd font-extrabold text-sm focus:outline-none hover:bg-paragraph hover:border-transparent hover:text-black"
        onClick={handleOpenTask}
      >
        {name}
      </button>
      {open && (
        <div className={alignmentClasses}>
          {children}
          <div className="text-white flex gap-x-2 justify-end">
            <button
              onClick={() => {
                onCancel();
                toggle(false);
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave();
                toggle(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownButton;
