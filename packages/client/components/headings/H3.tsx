import React from "react";

type Props = {
  children: React.ReactNode;
};

function H3({ children }: Props) {
  return <h3 className=" text-heading-3 leading-heading-3">{children}</h3>;
}

export default H3;
