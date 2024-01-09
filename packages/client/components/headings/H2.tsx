import React from "react";

type Props = {
  children: React.ReactNode;
};

function H2({ children }: Props) {
  return <h2 className=" text-heading-2 leading-heading-2">{children}</h2>;
}

export default H2;
