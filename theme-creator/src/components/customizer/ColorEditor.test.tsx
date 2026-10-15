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

  it("declares aria-invalid='true' and links contrast error container via aria-describedby when contrast ratio fails", () => {
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        currentTheme: {
          colorScheme: {
            primary: "#000000",
            onPrimary: "#111111", // Very low contrast ratio < 4.5
          },
        },
      },
      dispatch: jest.fn(),
    });

    render(<ColorEditor />);

    const primaryInput = document.querySelector<HTMLInputElement>(
      'input[type="color"][value="#000000"]',
    );
    const onPrimaryInput = document.querySelector<HTMLInputElement>(
      'input[type="color"][value="#111111"]',
    );

    expect(primaryInput).not.toBeNull();
    expect(onPrimaryInput).not.toBeNull();

    expect(primaryInput).toHaveAttribute("aria-invalid", "true");
    expect(onPrimaryInput).toHaveAttribute("aria-invalid", "true");

    const describedBy = primaryInput?.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const alertEl = document.getElementById(describedBy!);
    expect(alertEl).not.toBeNull();
    expect(alertEl?.getAttribute("role")).toBe("alert");
    expect(alertEl).toHaveClass("warn");
  });
});
