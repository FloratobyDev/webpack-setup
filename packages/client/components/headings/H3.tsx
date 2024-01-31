import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H3({ classname, children }: Props) {
  const h3Classes = classNames(
    "text-heading-3 leading-heading-3 font-poppins font-normal",
    classname,
  );
  return <h3 className={h3Classes}>{children}</h3>;
}

export default H3;
