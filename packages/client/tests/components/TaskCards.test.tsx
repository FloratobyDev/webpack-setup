import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import React from "react";
import TaskCards from "@client/pages/Journal/TaskCards";

beforeEach(() => jest.clearAllMocks());

const mockAddTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockOnRemove = jest.fn();
const mockTasks = [
  {
    name: "task1",
    progress: "Open",
    difficulty: "hard",
    taskId: "1",
    checklist: [{ checked: false, checklistId: "1", description: "test" }],
  },
  {
    name: "task2",
    progress: "Open",
    difficulty: "hard",
    taskId: "2",
    checklist: [],
  },
  {
    name: "task3",
    progress: "Open",
    difficulty: "hard",
    taskId: "3",
    checklist: [],
  },
];
jest.mock("@client/contexts/TaskContext", () => ({
  useTask: () => ({
    tasks: mockTasks,
    onUpdateTask: mockUpdateTask,
    onUpdateChecklist: jest.fn().mockImplementation(() => jest.fn()),
  }),
}));

describe("TaskCards component", () => {
  it("renders", () => {
    render(<TaskCards />);
  });

  describe("Header tabs", () => {
    it("renders header tabs", () => {
      render(<TaskCards />);
      const openButton = screen.getByText("In-Progress");
      expect(openButton).toBeInTheDocument();
    });

    it("set open tab as active", () => {
      render(<TaskCards />);
      const openButton = screen.getByTestId("In-Progress-tab");
      fireEvent.click(openButton);
      expect(openButton).toBeInTheDocument();
      expect(openButton).toHaveClass("bg-black");
    });
  });

  describe("Search bar", () => {
    it("renders a search bar", () => {
      render(<TaskCards />);
      const searchbar = screen.getByText("search");
      expect(searchbar).toBeInTheDocument();
    });

    it("filters tasks when typing", () => {
      render(<TaskCards />);
      const searchbar = screen.getByTestId("searchbar");
      fireEvent.change(searchbar, { target: { value: "task1" } });
      const tasks = screen.getAllByText(/task/i);
      expect(tasks.length).toBe(1);
    });

    it("should not have any task displayed", () => {
      render(<TaskCards />);
      const searchbar = screen.getByTestId("searchbar");
      fireEvent.change(searchbar, { target: { value: "task4" } });
      const tasks = screen.queryByText(/task/i);
      expect(tasks).not.toBeInTheDocument();
    });
  });

  describe("Task cards", () => {
    it("renders a task card", () => {
      render(<TaskCards />);
      expect(screen.getByText("task1")).toBeInTheDocument();
    });

    it("renders multiple task cards", () => {
      render(<TaskCards />);
      const tasks = screen.getAllByText(/task/i);
      expect(tasks.length).toBe(3);
    });

    it("is not clickable when there's no checklist", () => {
      render(<TaskCards />);
      const task = screen.getByText("task2");
      fireEvent.click(task);
      expect(mockAddTask).not.toHaveBeenCalled();
    });

    it("is clickable when there's a checklist", () => {
      render(<TaskCards />);
      const task = screen.getByText("task1");
      fireEvent.click(task);
      const checklists = screen.getAllByRole("checkbox");
      expect(checklists.length).toBe(1);
    });
    it("has no checklist", () => {
      render(<TaskCards />);
      const task = screen.getByText("task1");
      fireEvent.click(task);
      fireEvent.click(task);
      const checklists = screen.queryByRole("checkbox");
      screen.debug();
      expect(checklists).not.toBeInTheDocument();
    });

    it("is checked when clicked", () => {
      render(<TaskCards />);
      const task = screen.getByText("task1");
      fireEvent.click(task);
      const checklist = screen.getByRole("checkbox");
      fireEvent.click(checklist);
      expect(checklist).toBeChecked();
    });

    it("opens a dropdown when Open is clicked", () => {
      render(<TaskCards />);
      const taskOneByTestId = screen.getByTestId("1");
      const open = within(taskOneByTestId).getByText("Open");
      fireEvent.click(open);
      const dropdown = screen.getByTestId("1-progress");
      expect(dropdown).toBeInTheDocument();
    });

    it("moves task1 to In-Progress when clicked", async () => {
      render(<TaskCards />);
      const taskOneByTestId = screen.getByTestId("1");
      const open = within(taskOneByTestId).getByText("Open");
      fireEvent.click(open);

      const taskDropdown = screen.getByTestId("1-progress");
      expect(taskDropdown).toBeInTheDocument();

      const inProgress = within(taskDropdown).getByText("In-Progress");
      expect(inProgress).toBeInTheDocument();

      fireEvent.click(inProgress);
      expect(mockUpdateTask).toHaveBeenCalledWith("1", "In-Progress");

      await waitFor(() => {
        expect(screen.queryByTestId("1")).not.toBeInTheDocument();
      });
    });
  });
});
