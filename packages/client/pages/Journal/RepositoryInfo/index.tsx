import { H3, H5, H6 } from "@client/components/headings";
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
      <section className="flex flex-col gap-y-1.5">
        <H3 classname="font-semibold capitalize text-primary-yellow">{name}</H3>
        <p className="font-jost text-[1rem]">
          There is some description written right here to explain what this
          repository is all about.There is some description written right here to
          explain what this repository is all about.
        </p>
      </section>
      <section className="flex flex-col gap-y-1.5">
        <H3 classname="font-semibold capitalize text-primary-yellow">Languages</H3>
        {/* <H6>
          {languages.map((language, idx) => (
            <span key={language}>
              {language}
              {idx < languages.length - 1 ? "," : ""}
            </span>
          ))}
        </H6> */}
        <p className="font-jost font-normal text-[1rem]">
          HTML, CSS, Javascript, TypeScript
        </p>
      </section>
    </Paper>
  );
}

export default RepositoryInfo;
