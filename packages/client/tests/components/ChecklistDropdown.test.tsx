import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ChecklistDropdown from "@client/pages/Journal/TaskEditor/ChecklistDropdown"; // Adjust the import path as necessary
import React from "react";

beforeEach(() => jest.clearAllMocks());

describe("ChecklistDropdown Component", () => {
  const mockChecklist = [
    { description: "Task 1", checked: false, checklistId: "1989" },
    { description: "Task 2", checked: false, checklistId: "2787" },
  ];
  const mockSetChecklist = jest.fn();
  const mockOnAddCheck = jest.fn();

  it("renders without crashing", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
  });

  it("allows typing in the input field", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
    const inputField = screen.getByAltText("checklist") as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "New Task" } });
    expect(inputField.value).toBe("New Task");
  });

  it("displays checklist items", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
    mockChecklist.forEach((task) => {
      expect(screen.getByText(task.description)).toBeInTheDocument();
    });
  });

  it("removes a task when Remove button is clicked", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
    const removeButton = screen.getAllByText("Remove")[0]; // Click the first remove button
    fireEvent.click(removeButton);
    expect(mockSetChecklist).toHaveBeenCalledWith([
      mockChecklist[1], // Expecting the second task to remain
    ]);
  });

  it("adds a task and clears input when Add button is clicked", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
    const inputField = screen.getByPlaceholderText(
      "Write checklist here..."
    ) as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "New Task" } });
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);
    expect(mockOnAddCheck).toHaveBeenCalledWith("New Task");
    expect(inputField.value).toBe(""); // Checking if input is cleared after adding
  });

  it("does not add a task when input is empty and Add button is clicked", () => {
    render(
      <ChecklistDropdown
        checklist={mockChecklist}
        onAddCheck={mockOnAddCheck}
        setChecklist={mockSetChecklist}
      />
    );
    const inputField = screen.getByPlaceholderText("Write checklist here...");
    fireEvent.change(inputField, { target: { value: "" } });
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);
    expect(mockOnAddCheck).not.toHaveBeenCalled();
  });
});
