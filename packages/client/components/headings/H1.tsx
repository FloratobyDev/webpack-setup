import React from "react";

type Props = {
  children: React.ReactNode;
};

function H1({ children }: Props) {
  return <h1 className=" text-heading-1 leading-heading-1">{children}</h1>;
}

export default H1;
