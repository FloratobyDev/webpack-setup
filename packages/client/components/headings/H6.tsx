import React from "react";

type Props = {
  children: React.ReactNode;
};

function H6({ children }: Props) {
  return <h6 className=" text-heading-6 leading-heading-6">{children}</h6>;
}

export default H6;
