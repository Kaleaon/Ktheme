import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SkipLink } from "./SkipLink";

describe("SkipLink Component", () => {
  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("renders with default props and text", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("skip-link");
  });

  it("accepts custom targetId and custom children", () => {
    render(<SkipLink targetId="custom-main">Jump to content</SkipLink>);
    const link = screen.getByRole("link", { name: "Jump to content" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#custom-main");
  });

  it("accepts custom href with hash prefix", () => {
    render(<SkipLink href="#another-target">Skip to another target</SkipLink>);
    const link = screen.getByRole("link", { name: "Skip to another target" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#another-target");
  });

  it("is visually hidden by default and becomes visible on focus", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });

    // Initially hidden
    expect(link).toHaveStyle({
      position: "absolute",
      clip: "rect(0, 0, 0, 0)",
    });

    // Becomes visible on focus with high contrast
    fireEvent.focus(link);
    expect(link).toHaveStyle({
      position: "fixed",
      clip: "auto",
      backgroundColor: "#0f172a",
      color: "#ffffff",
    });

    // Hidden again on blur
    fireEvent.blur(link);
    expect(link).toHaveStyle({
      position: "absolute",
      clip: "rect(0, 0, 0, 0)",
    });
  });

  it("shifts DOM focus to the target element and calls replaceState on click", () => {
    const mainEl = document.createElement("main");
    mainEl.id = "main-content";
    mainEl.scrollIntoView = jest.fn();
    document.body.appendChild(mainEl);

    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    render(<SkipLink targetId="main-content" />);
    const link = screen.getByRole("link", { name: "Skip to main content" });

    fireEvent.click(link);

    // Should set tabindex="-1" on the target if not present
    expect(mainEl).toHaveAttribute("tabindex", "-1");
    // Should focus the target
    expect(document.activeElement).toBe(mainEl);
    // Should call scrollIntoView
    expect(mainEl.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
    // Should update history via replaceState
    expect(replaceStateSpy).toHaveBeenCalledWith(null, "", "#main-content");
  });

  it("gracefully handles click when target element is not found", () => {
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    render(<SkipLink targetId="non-existent-id" />);
    const link = screen.getByRole("link", { name: "Skip to main content" });

    // Should not throw
    expect(() => fireEvent.click(link)).not.toThrow();
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });
});
