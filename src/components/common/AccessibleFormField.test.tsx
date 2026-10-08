import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AccessibleFormField, useAccessibleFormFieldContext } from "./AccessibleFormField";

function CustomControl() {
  const ctx = useAccessibleFormFieldContext();
  return (
    <input
      id={ctx?.id}
      aria-describedby={ctx?.ariaDescribedBy}
      aria-invalid={ctx?.ariaInvalid}
      placeholder="Custom Control Input"
    />
  );
}

describe("AccessibleFormField Helper Wrapper Component", () => {
  it("automatically binds label htmlFor to child input id", () => {
    render(
      <AccessibleFormField label="Theme Name">
        <input placeholder="Enter theme name" />
      </AccessibleFormField>,
    );

    const label = screen.getByText("Theme Name");
    const input = screen.getByPlaceholderText("Enter theme name");

    expect(label.tagName.toLowerCase()).toBe("label");
    expect(label.getAttribute("for")).toBeTruthy();
    expect(input.id).toBe(label.getAttribute("for"));
  });

  it("links error text via aria-describedby and sets aria-invalid='true'", () => {
    render(
      <AccessibleFormField label="Font Size" error="Font size must be a positive number">
        <input placeholder="Font size" />
      </AccessibleFormField>,
    );

    const input = screen.getByPlaceholderText("Font size");
    const errorMsg = screen.getByText("Font size must be a positive number");

    expect(errorMsg.id).toBeTruthy();
    expect(errorMsg.getAttribute("role")).toBe("alert");
    expect(errorMsg.getAttribute("aria-live")).toBe("assertive");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-errormessage")).toBe(errorMsg.id);
    expect(input.getAttribute("aria-describedby")).toBe(errorMsg.id);
  });

  it("supports explicit errorId and hideErrorContainer option", () => {
    render(
      <div>
        <div id="shared-error-id" role="alert" aria-live="assertive">
          Invalid input value
        </div>
        <AccessibleFormField
          label="Password"
          error="Invalid input value"
          errorId="shared-error-id"
          hideErrorContainer
        >
          <input placeholder="Enter password" />
        </AccessibleFormField>
      </div>,
    );

    const input = screen.getByPlaceholderText("Enter password");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("shared-error-id");
    expect(input.getAttribute("aria-errormessage")).toBe("shared-error-id");
  });

  it("supports invalid prop without error node", () => {
    render(
      <AccessibleFormField label="Username" invalid errorId="custom-error-container">
        <input placeholder="Enter username" />
      </AccessibleFormField>,
    );

    const input = screen.getByPlaceholderText("Enter username");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("custom-error-container");
  });

  it("augments nested inputs when child is a wrapper element", () => {
    render(
      <AccessibleFormField label="Color" error="Invalid hex code">
        <label className="color-picker">
          <input type="color" data-testid="nested-color-input" />
          <span>Color Label</span>
        </label>
      </AccessibleFormField>,
    );

    const input = screen.getByTestId("nested-color-input");
    const errorMsg = screen.getByText("Invalid hex code");

    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(errorMsg.id);
  });

  it("provides context for custom child components", () => {
    render(
      <AccessibleFormField label="Context Field" helperText="Context helper">
        <CustomControl />
      </AccessibleFormField>,
    );

    const label = screen.getByText("Context Field");
    const input = screen.getByPlaceholderText("Custom Control Input");
    const helper = screen.getByText("Context helper");

    expect(input.id).toBe(label.getAttribute("for"));
    expect(input.getAttribute("aria-describedby")).toBe(helper.id);
  });
});
