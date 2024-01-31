import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H7({ classname, children }: Props) {
  const h7Classes = classNames(
    "text-heading-7 leading-heading-7 font-poppins font-normal",
    classname,
  );
  return <p className={h7Classes}>{children}</p>;
}

export default H7;
