import React from "react";

type Props = {
  children: React.ReactNode;
};

function H5({ children }: Props) {
  return <h5 className=" text-heading-5 leading-heading-5">{children}</h5>;
}

export default H5;
