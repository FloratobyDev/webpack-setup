import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type Props = {
  active?: boolean;
  iconSvg: React.ReactNode;
  label?: string;
} & HTMLAttributes<HTMLButtonElement>;

function Button({ active, iconSvg, label = "", ...rest }: Props) {
  const buttonClasses = classNames(
    "p-3 rounded-md hover:bg-primary-black flex items-center justify-center",
    {
      "bg-primary-black": active,
    },
  );

  return (
    <button {...rest} className={buttonClasses}>
      {iconSvg}
      {label}
    </button>
  );
}

export default Button;
