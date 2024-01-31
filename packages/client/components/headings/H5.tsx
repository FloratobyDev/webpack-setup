import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  classname?: string;
};

function H5({ classname, children }: Props) {
  const h5Classes = classNames(
    "text-heading-5 leading-heading-5 font-poppins font-normal",
    classname,
  );
  return <h5 className={h5Classes}>{children}</h5>;
}

export default H5;
