import React from "react";

type Props = {
  children: React.ReactNode;
};

function H7({ children }: Props) {
  return <h6 className=" text-heading-7 leading-heading-7">{children}</h6>;
}

export default H7;
