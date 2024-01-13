// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import "@testing-library/jest-dom";
import MainPage from "@client/pages/MainPage";
import { Pages } from "@client/types";
import React from "react";
import { render } from "@testing-library/react";
import RepositoryProvider from "@client/contexts/RepositoryContext";
import TaskProvider from "@client/contexts/TaskContext";
// Mock the modules

describe("MainPage Component", () => {
  it("renders without crashing", () => {
    render(<MainPage activeLink="" />);
  });

  it("renders Journal when activeLink is JOURNAL", () => {
    const { getByText } = render(
      <RepositoryProvider>
        <TaskProvider>
          <MainPage activeLink={Pages.JOURNAL} />
        </TaskProvider>
      </RepositoryProvider>
    );
    expect(getByText("Tasks")).toBeInTheDocument();
  });

  it("renders Settings when activeLink is SETTINGS", () => {
    const { getByText } = render(<MainPage activeLink={Pages.SETTINGS} />);
    expect(getByText("Settings")).toBeInTheDocument();
  });

  it("does not render Journal or Settings for invalid activeLink", () => {
    const { queryByTestId } = render(<MainPage activeLink="nonexistent" />);
    expect(queryByTestId("journal")).not.toBeInTheDocument();
    expect(queryByTestId("settings")).not.toBeInTheDocument();
  });

  // Snapshot test
  it("matches snapshot", () => {
    const tree = render(<MainPage activeLink="" />);
    expect(tree).toMatchSnapshot();
  });
});
