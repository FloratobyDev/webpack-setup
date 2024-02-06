import React, { MouseEvent, useRef, useState } from "react";
import classNames from "classnames";
import useOutsideClick from "@client/hooks/useOutsideClick";

type Props = {
  label: string;
  hovered?: boolean;
  children: React.ReactNode;
};

function HoverDropdown({ label, hovered, children }: Props) {
  const [show, setShow] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  function handleOpen(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setShow(!show);
  }

  useOutsideClick(divRef, show, () => {
    setShow(false);
  });

  const divClasses = classNames("relative text-white rounded-smd px-3 py-0.5", {
    "bg-primary-black": hovered,
    "bg-black-75": !hovered,
  });

  return (
    <div className={divClasses} onClick={handleOpen} ref={divRef}>
      <button>{label}</button>
      {show && (
        <div className="absolute right-0 bg-primary-black border border-primary-outline p-1.5 rounded-smd z-10 top-8">
          {children}
        </div>
      )}
    </div>
  );
}

export default HoverDropdown;
