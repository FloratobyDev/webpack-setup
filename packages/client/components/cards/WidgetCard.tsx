import React from "react";

type Props = {
  title: string;
  description: string;
  onClick: () => void;
  classnames?: string;
};

function WidgetCard({ title, description, onClick, classnames }: Props) {

  return (
    <div className="flex flex-col gap-y-1 bg-black grow">
      <div className="flex justify-between">
        <h5>{title}</h5>
        <button onClick={onClick}>+</button>
      </div>
      <p>{description}</p>
    </div>
  );
}

export default WidgetCard;
