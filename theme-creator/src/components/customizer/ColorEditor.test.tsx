import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ColorEditor } from "./ColorEditor";
import { useTheme } from "../../state/ThemeContext";

jest.mock("../../state/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("ColorEditor", () => {
  it("renders color pickers and calculates contrast ratio correctly using core engine", () => {
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        currentTheme: {
          colorScheme: {
            primary: "#000000",
            onPrimary: "#FFFFFF",
          },
        },
      },
      dispatch: jest.fn(),
    });

    render(<ColorEditor />);
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getAllByText("21.0:1 AA")[0]).toBeInTheDocument();
  });
});
