import { H5, H6 } from "@client/components/headings";
import React from "react";

type Props = {
  name: string;
  description: string;
  languages: string[];
};

function RepositoryInfo({ name, description, languages }: Props) {
  return (
    <>
      <H5>{name}</H5>
      <H6>{description}</H6>
      <H5>Languages</H5>
      <H6>
        {languages.map((language, idx) => (
          <span key={language}>
            {language}
            {idx < languages.length - 1 ? "," : ""}
          </span>
        ))}
      </H6>
    </>
  );
}

export default RepositoryInfo;
