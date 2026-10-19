import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AIDesigner } from "./AIDesigner";
import { useTheme } from "../../state/ThemeContext";

jest.mock("../../state/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("AIDesigner Accessibility Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        currentTheme: { metadata: { name: "Test Theme" }, colorScheme: {} },
        savedThemes: [],
      },
      dispatch: jest.fn(),
    });
  });

  it("renders API key input with autoComplete='off'", () => {
    render(<AIDesigner />);

    const apiKeyInput = screen.getByPlaceholderText("sk-ant-...");
    expect(apiKeyInput).toBeInTheDocument();
    expect(apiKeyInput).toHaveAttribute("autocomplete", "off");
  });
});
