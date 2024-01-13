// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Button from "@client/components/buttons/Button";
import React from "react";
import RepositoryProvider from "@client/contexts/RepositoryContext";
import TaskEditor from "@client/pages/Journal/TaskEditor";
import TaskProvider from "@client/contexts/TaskContext";

describe("Button", () => {
  test("renders button role with label hi", () => {
    render(<Button label="hi" />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("hi");
  });
});

describe("TaskEditor", () => {
  test("renders task editor", () => {
    render(
      <RepositoryProvider>
        <TaskProvider>
          <TaskEditor />
        </TaskProvider>
      </RepositoryProvider>
    );
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });
});
