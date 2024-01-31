import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function Paper({ children, classname }: Props) {
  const divClasses = classNames("p-3", classname);
  return <div className={divClasses}>{children}</div>;
}

export default Paper;
