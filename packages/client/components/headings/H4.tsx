import React from "react";

type Props = {
  children: React.ReactNode;
};

function H4({ children }: Props) {
  return <h4 className=" text-heading-4 leading-heading-4">{children}</h4>;
}

export default H4;
