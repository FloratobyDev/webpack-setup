import React, { HTMLAttributes, useState } from "react";
import classNames from "classnames";

type Props = {
  name: string;
  hasAlert?: boolean;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

function RepoButton({ name, hasAlert, active, ...rest }: Props) {
  const [hasAlertValue, setHasAlertValue] = useState<boolean>(hasAlert);
  const alertClass = classNames("h-2 w-2 rounded-full bg-red-500", {
    invisible: !hasAlertValue,
  });

  const buttonClass = classNames(
    "hover:bg-black w-full hover:text-white flex items-center font-poppins gap-x-1 px-2 py-1 rounded-md",
    {
      "bg-black text-white": active,
    },
  );
  return (
    <div
      className="w-full"
      onClick={() => {
        setHasAlertValue(false);
      }}
    >
      <button {...rest} className={buttonClass}>
        <span aria-label="alert-circle" className={alertClass} />
        {name}
      </button>
    </div>
  );
}

export default RepoButton;
