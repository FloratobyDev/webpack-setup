import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H2({ classname, children }: Props) {
  const h2Classes = classNames(
    "text-heading-2 leading-heading-2 font-poppins font-normal",
    classname,
  );
  return <h2 className={h2Classes}>{children}</h2>;
}

export default H2;
