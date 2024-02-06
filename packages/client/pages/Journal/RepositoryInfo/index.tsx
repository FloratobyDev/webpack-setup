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
      <section className="flex flex-col gap-y-1.5 mt-1">
        <H4 classname="capitalize text-primary-yellow font-black text-lg">
          {name}
        </H4>
        <p className="text-sm first:capitalize">{description}</p>
      </section>
      <section className="flex flex-col gap-y-1.5">
        <H4 classname="font-black capitalize text-primary-yellow ">
          Languages
        </H4>
        <p className="text-sm">HTML, CSS, Javascript, TypeScript</p>
      </section>
    </Paper>
  );
}

export default RepositoryInfo;
