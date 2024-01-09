import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type Props = {
  name: string;
  hasAlert?: boolean;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

function RepoButton({ name, hasAlert, active, ...rest }: Props) {
  const alertClass = classNames("h-2 w-2 rounded-full bg-red-500", {
    hidden: hasAlert,
  });

  const buttonClass = classNames(
    "hover:bg-black hover:text-white flex items-center font-poppins gap-x-1 px-2 py-1 rounded-md",
    {
      "bg-black text-white": active,
    },
  );
  return (
    <button {...rest} className={buttonClass}>
      <span aria-label="alert-circle" className={alertClass} />
      {name}
    </button>
  );
}

export default RepoButton;
