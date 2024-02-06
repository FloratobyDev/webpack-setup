import React, { HTMLAttributes, useState } from "react";
import classNames from "classnames";

type Props = {
  name: string;
  hasAlert?: boolean;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

function RepoButton({ name, hasAlert, active, ...rest }: Props) {
  // const [hasAlertValue, setHasAlertValue] = useState<boolean>(hasAlert);
  const alertClass = classNames("h-2 w-2 rounded-full bg-red-500", {
    invisible: !hasAlert,
  });

  const buttonClass = classNames(
    "hover:bg-primary-black w-full hover:text-white flex items-center gap-x-1 px-2 py-1 rounded-md text-md",
    {
      "bg-primary-black text-white": active,
    },
  );
  return (
    <div
      className="w-full my-0.5"
      // onClick={() => {
      //   setHasAlertValue(false);
      // }}
    >
      <button {...rest} className={buttonClass}>
        <span aria-label="alert-circle" className={alertClass} />
        {name}
      </button>
    </div>
  );
}

export default RepoButton;
