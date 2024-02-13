import React, { HTMLAttributes } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

type Props = {
  active?: boolean;
  iconSvg?: React.ReactNode;
  label?: string;
  page: string;
} & HTMLAttributes<HTMLButtonElement>;

function LinkButton({ active, iconSvg, label = "", page, ...rest }: Props) {
  const linkButtonClasses = classNames(
    "p-2.5 py-3 rounded-md hover:bg-primary-black flex items-center justify-center w-full border",
    {
      "bg-primary-black border-primary-outline": active,
      "border-transparent": !active,
    },
  );

  return (
    <Link to={page}>
      <button {...rest} className={linkButtonClasses}>
        {iconSvg}
        {label}
      </button>
    </Link>
  );
}

export default LinkButton;
