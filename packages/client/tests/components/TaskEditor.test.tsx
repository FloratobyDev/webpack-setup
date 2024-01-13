// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TaskEditor from "@client/pages/Journal/TaskEditor";

// Mocking TaskContext
const mockAddTask = jest.fn();
jest.mock("@client/contexts/TaskContext", () => ({
  useTask: () => ({
    onAddTask: mockAddTask,
  }),
}));

describe("TaskEditor", () => {
  test("renders task editor", () => {
    render(<TaskEditor />);
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });
});

describe("TaskEditor Component", () => {
  it("initializes with default state values", () => {
    render(<TaskEditor />);
    expect(screen.getByPlaceholderText("Write task here...")).toHaveValue("");
    // Add more assertions for other initial state values
  });

  it("opens checklist dropdown when button is clicked", () => {
    render(<TaskEditor />);
    const button = screen.getByRole("button", { name: "Addc" });
    fireEvent.click(button);
    // expect(
    //   screen.getByPlaceholderText("Write task here...")
    // ).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  // Add similar tests for opening DifficultyDropdown and Deadline input

  // it("calls onAddTask with correct parameters on Send button click", () => {
  //   render(<TaskEditor />);
  //   fireEvent.change(screen.getByPlaceholderText("Write task here..."), {
  //     target: { value: "New Task" },
  //   });
  //   fireEvent.click(screen.getByText("Send"));
  //   expect(mockAddTask).toHaveBeenCalledWith({
  //     name: "New Task",
  //     difficulty: "easy",
  //     deadline: "",
  //     checklist: expect.any(Array),
  //     taskId: expect.any(String),
  //     progress: ProgressType.OPEN,
  //   });
  // });

  // Add more tests as per the points mentioned above
});
