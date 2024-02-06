import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H1({ classname, children }: Props) {
  const h1Classes = classNames(
    "text-heading-1 leading-heading-1",
    classname,
  );
  return <h1 className={h1Classes}>{children}</h1>;
}

export default H1;
