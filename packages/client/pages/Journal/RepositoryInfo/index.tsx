import { H4, H5, H6 } from "@client/components/headings";
import Paper from "@client/components/layout/Paper";
import React from "react";

type Props = {
  name: string;
  description: string;
  languages: string[];
};

function RepositoryInfo({ name, description, languages }: Props) {
  return (
    <Paper classname="flex flex-col gap-y-4">
      <section className="flex flex-col gap-y-1 mt-1">
        <H4 classname="first-letter:capitalize text-primary-yellow font-black text-md">
          {name}
        </H4>
        <p className="text-md first:capitalize">{description}</p>
      </section>
      <section className="flex flex-col gap-y-1">
        <H4 classname="font-black first-letter:capitalize text-primary-yellow">
          Languages
        </H4>
        <p className="text-md">HTML, CSS, Javascript, TypeScript</p>
      </section>
    </Paper>
  );
}

export default RepositoryInfo;
