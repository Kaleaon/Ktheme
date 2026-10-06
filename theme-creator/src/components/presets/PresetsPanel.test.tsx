import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PresetsPanel } from "./PresetsPanel";
import { useTheme } from "../../state/ThemeContext";

jest.mock("../../state/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

const mockSavedTheme = {
  metadata: {
    id: "saved-custom-1",
    name: "My Custom Theme",
    description: "A custom user theme",
    tags: ["custom", "test"],
  },
  colorScheme: {
    background: "#000000",
    onBackground: "#ffffff",
    primary: "#ff0000",
    secondary: "#00ff00",
    tertiary: "#0000ff",
    surface: "#111111",
    onSurface: "#eeeeee",
    error: "#ff0055",
    surfaceVariant: "#222222",
  },
};

describe("PresetsPanel Theme Deletion Dialog", () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        savedThemes: [mockSavedTheme],
      },
      dispatch: mockDispatch,
    });
  });

  it("does not delete theme immediately when delete button is clicked, but opens confirmation dialog", () => {
    render(<PresetsPanel />);

    // Switch to Saved tab
    const savedTab = screen.getByRole("tab", { name: /Saved/i });
    fireEvent.click(savedTab);

    // Click Delete button on saved theme card
    const deleteCardBtn = screen.getByRole("button", {
      name: /Delete saved theme My Custom Theme/i,
    });
    fireEvent.click(deleteCardBtn);

    // DELETE_SAVED should not have been dispatched yet
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "DELETE_SAVED" })
    );

    // Modal dialog should be displayed with dialog role and aria-modal="true"
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.getAttribute("aria-modal")).toBe("true");

    // Modal content check inside dialog
    const dialogUtils = within(dialog);
    expect(dialogUtils.getByText("Delete Theme")).toBeInTheDocument();
    expect(
      dialogUtils.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();
    expect(dialogUtils.getByText("My Custom Theme")).toBeInTheDocument();
  });

  it("dismisses modal and does not dispatch DELETE_SAVED when Cancel button is clicked", () => {
    render(<PresetsPanel />);

    // Switch to Saved tab and click delete icon
    fireEvent.click(screen.getByRole("tab", { name: /Saved/i }));
    fireEvent.click(
      screen.getByRole("button", {
        name: /Delete saved theme My Custom Theme/i,
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Click Cancel button
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "DELETE_SAVED" })
    );
  });

  it("dismisses modal and does not dispatch DELETE_SAVED when Escape key is pressed", () => {
    render(<PresetsPanel />);

    fireEvent.click(screen.getByRole("tab", { name: /Saved/i }));
    fireEvent.click(
      screen.getByRole("button", {
        name: /Delete saved theme My Custom Theme/i,
      })
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "DELETE_SAVED" })
    );
  });

  it("dispatches DELETE_SAVED with theme ID and closes modal when Delete button in dialog is clicked", () => {
    render(<PresetsPanel />);

    fireEvent.click(screen.getByRole("tab", { name: /Saved/i }));
    fireEvent.click(
      screen.getByRole("button", {
        name: /Delete saved theme My Custom Theme/i,
      })
    );

    const confirmDeleteBtn = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(confirmDeleteBtn);

    // Dispatch should be called with DELETE_SAVED and payload "saved-custom-1"
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "DELETE_SAVED",
      payload: "saved-custom-1",
    });

    // Dialog should be closed
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
