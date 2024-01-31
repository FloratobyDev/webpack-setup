import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H6({ classname, children }: Props) {
  const h6Classes = classNames(
    "text-heading-6 leading-heading-6 font-poppins font-normal",
    classname,
  );
  return <h6 className={h6Classes}>{children}</h6>;
}

export default H6;
