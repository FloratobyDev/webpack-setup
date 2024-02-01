import React, { useState } from "react";
import classNames from "classnames";
import RotatedCross from "../svgs/RotatedCross";

type Props = {
  onClick: (checkValue: boolean) => void;
  checked?: boolean;
};

function RadioButton({ onClick, checked }: Props) {

  const divClasses = classNames(
    "h-4 w-4 rounded-[4px] flex items-center justify-center cursor-pointer",
    {
      "bg-primary-yellow": checked,
      "border border-primary-yellow": !checked,
    },
  );
  return (
    <div
      className={divClasses}
      onClick={() => {
        onClick(!checked);
      }}
    >
      {checked && <RotatedCross black={!checked} />}
    </div>
  );
}

export default RadioButton;
