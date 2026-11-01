import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AIDesigner } from "./AIDesigner";
import { useTheme } from "../../state/ThemeContext";

jest.mock("../../state/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("AIDesigner Autofill & Accessibility Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      state: {},
      dispatch: jest.fn(),
    });
  });

  it("renders API key password input with autoComplete='current-password'", () => {
    render(<AIDesigner />);
    const apiKeyInput = screen.getByPlaceholderText("sk-ant-...");
    expect(apiKeyInput).toBeInTheDocument();
    expect(apiKeyInput).toHaveAttribute("type", "password");
    expect(apiKeyInput).toHaveAttribute("autoComplete", "current-password");
  });
});
