import React from "react";

type Props = {
  children: React.ReactNode;
};

function PageLayout({ children }: Props) {
  return (
    <div className="max-h-screen p-2 h-screen flex text-white">
      {children}
      <div className="bg-primary-black fixed inset-0 -z-10" />
    </div>
  );
}

export default PageLayout;
