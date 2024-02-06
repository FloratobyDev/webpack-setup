import React from "react";

type Props = {
  children: React.ReactNode;
};

function PageLayout({ children }: Props) {
  return (
    <div className="max-h-screen h-screen flex text-white bg-primary-black font-gothic">
      {children}
    </div>
  );
}

export default PageLayout;
