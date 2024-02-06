import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H4({ classname, children }: Props) {
  const h4Classes = classNames(
    "text-heading-4 leading-heading-4",
    classname,
  );
  return <h4 className={h4Classes}>{children}</h4>;
}

export default H4;
