import React, { forwardRef, RefObject } from "react";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function Paper({ children, classname }: Props, ref: RefObject<HTMLDivElement>) {
  const divClasses = classNames("p-4", classname);
  return (
    <div className={divClasses} ref={ref}>
      {children}
    </div>
  );
}

export default forwardRef(Paper);
