import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KthemeProvider } from "../src/KthemeProvider";
import { ThemeStudio } from "../src/studio/ThemeStudio";
import { calcContrastRatio, calcLuminance, auditThemeTokens } from "../src/studio/contrast";

describe("ThemeStudio Real-Time WCAG Contrast Auditing", () => {
  it("audits relative luminance and contrast ratio accurately", () => {
    // Pure black vs pure white
    expect(calcLuminance("#000000")).toBe(0);
    expect(calcLuminance("#FFFFFF")).toBe(1);
    expect(calcContrastRatio("#000000", "#FFFFFF")).toBe(21);

    // Short hex format
    expect(calcContrastRatio("#000", "#fff")).toBe(21);

    // Invalid hex format falls back safely without throwing
    expect(calcLuminance("not-a-color")).toBe(0.5);
    expect(calcContrastRatio("invalid-1", "invalid-2")).toBe(1);

    // auditThemeTokens structured output with fully compliant tokens
    const compliantAudit = auditThemeTokens({
      primary: "#D4AF37",
      background: "#0A1630",
      surface: "#1A2645",
      onSurface: "#E8E3D8",
      outline: "#FFFFFF",
    });
    expect(compliantAudit.pairs.length).toBeGreaterThanOrEqual(3);
    expect(compliantAudit.hasErrors).toBe(false);
    expect(compliantAudit.pass).toBe(true);

    // auditThemeTokens with low-contrast violations
    const violationAudit = auditThemeTokens({
      primary: "#0A1631",
      background: "#0A1630",
      surface: "#1A2645",
      onSurface: "#1A2645",
      outline: "#1A2645",
    });
    expect(violationAudit.hasErrors).toBe(true);
    expect(violationAudit.pass).toBe(false);
    expect(violationAudit.violations.length).toBeGreaterThanOrEqual(1);
  });

  it("renders live WCAG compliance badges next to all editable color tokens", () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded />
      </KthemeProvider>,
    );

    // Customizer tab is active by default
    const primaryBadge = screen.getByTestId("contrast-badge-primary");
    expect(primaryBadge).toBeInTheDocument();
    expect(primaryBadge.textContent).toContain("AA");

    const surfaceBadge = screen.getByTestId("contrast-badge-surface");
    expect(surfaceBadge).toBeInTheDocument();

    const outlineBadge = screen.getByTestId("contrast-badge-outline");
    expect(outlineBadge).toBeInTheDocument();

    const backgroundBadge = screen.getByTestId("contrast-badge-background");
    expect(backgroundBadge).toBeInTheDocument();
  });

  it("updates contrast badge dynamically when color changes and displays AA FAIL for low contrast", () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded />
      </KthemeProvider>,
    );

    const primaryInput = screen.getByLabelText("Primary Color color picker");
    expect(primaryInput).toBeInTheDocument();

    // Set primary color almost identical to background (#0A1630) to create a low-contrast pair
    act(() => {
      fireEvent.change(primaryInput, { target: { value: "#0B1731" } });
    });

    const primaryBadge = screen.getByTestId("contrast-badge-primary");
    expect(primaryBadge.textContent).toContain("AA FAIL");
    expect(primaryBadge).toHaveClass("fail");

    // Color input remains interactive and editable despite failing contrast
    act(() => {
      fireEvent.change(primaryInput, { target: { value: "#FFFFFF" } });
    });

    expect(primaryBadge.textContent).toContain("AA PASS");
    expect(primaryBadge).toHaveClass("pass");
  });

  it("triggers pre-save warning modal on contrast violations and allows dismiss or proceed", () => {
    const handleSave = jest.fn();

    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded onSave={handleSave} />
      </KthemeProvider>,
    );

    const primaryInput = screen.getByLabelText("Primary Color color picker");

    // Introduce low contrast primary
    act(() => {
      fireEvent.change(primaryInput, { target: { value: "#0A1631" } });
    });

    // Click Save to Device
    const saveBtn = screen.getByText("💾 Save to Device");
    act(() => {
      fireEvent.click(saveBtn);
    });

    // Warning modal should appear
    const modal = screen.getByTestId("contrast-warning-modal");
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(/WCAG AA Contrast Warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Primary vs Background/i)).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();

    // Dismiss modal
    const dismissBtn = screen.getByText("Dismiss / Cancel");
    act(() => {
      fireEvent.click(dismissBtn);
    });

    expect(screen.queryByTestId("contrast-warning-modal")).not.toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();

    // Click Save again and proceed anyway
    act(() => {
      fireEvent.click(saveBtn);
    });
    const saveAnywayBtn = screen.getByText("Save Anyway");
    act(() => {
      fireEvent.click(saveAnywayBtn);
    });

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("contrast-warning-modal")).not.toBeInTheDocument();
  });

  it("triggers pre-export warning modal on contrast violations and allows export anyway", () => {
    const handleExport = jest.fn();

    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded onExport={handleExport} />
      </KthemeProvider>,
    );

    const primaryInput = screen.getByLabelText("Primary Color color picker");

    // Introduce low contrast
    act(() => {
      fireEvent.change(primaryInput, { target: { value: "#0A1631" } });
    });

    // Click Export JSON
    const exportBtn = screen.getByText("📥 Export JSON");
    act(() => {
      fireEvent.click(exportBtn);
    });

    expect(screen.getByTestId("contrast-warning-modal")).toBeInTheDocument();
    expect(handleExport).not.toHaveBeenCalled();

    // Proceed with export anyway
    const exportAnywayBtn = screen.getByText("Export Anyway");
    act(() => {
      fireEvent.click(exportAnywayBtn);
    });

    expect(handleExport).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("contrast-warning-modal")).not.toBeInTheDocument();
  });

  it("exports and saves directly without warning modal when all contrast ratios pass", () => {
    const handleSave = jest.fn();
    const handleExport = jest.fn();

    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded onSave={handleSave} onExport={handleExport} />
      </KthemeProvider>,
    );

    // Fix outline contrast by changing it to a high-contrast color (#FFFFFF)
    const outlineInput = screen.getByLabelText("Outline / Stroke color picker");
    act(() => {
      fireEvent.change(outlineInput, { target: { value: "#FFFFFF" } });
    });

    // Save should proceed directly without modal
    const saveBtn = screen.getByText("💾 Save to Device");
    act(() => {
      fireEvent.click(saveBtn);
    });
    expect(screen.queryByTestId("contrast-warning-modal")).not.toBeInTheDocument();
    expect(handleSave).toHaveBeenCalledTimes(1);

    // Export should proceed directly without modal
    const exportBtn = screen.getByText("📥 Export JSON");
    act(() => {
      fireEvent.click(exportBtn);
    });
    expect(screen.queryByTestId("contrast-warning-modal")).not.toBeInTheDocument();
    expect(handleExport).toHaveBeenCalledTimes(1);
  });
});
