import React, { MouseEvent, useState } from "react";

type Props = {
  label: string;
  children: React.ReactNode;
};

function HoverDropdown({ label, children }: Props) {
  const [open, setOpen] = useState(false);

  function handleOpen(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setOpen(!open);
  }
  return (
    <div
      className="relative text-white"
      onClick={handleOpen}
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
    >
      <button>{label}</button>
      {open && <div className="absolute bg-gray-200">{children}</div>}
    </div>
  );
}

export default HoverDropdown;
