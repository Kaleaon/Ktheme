import React, { useState } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useTablist, UseTablistOptions, KthemeProvider, ThemeStudio } from "../src";

function TestTablistComponent(props: Partial<UseTablistOptions>) {
  const tabs = props.tabs || [
    { id: "tab1", label: "Tab One" },
    { id: "tab2", label: "Tab Two" },
    { id: "tab3", label: "Tab Three", disabled: true },
    { id: "tab4", label: "Tab Four" },
  ];

  const { activeTab, getTablistProps, getTabProps, getPanelProps } = useTablist({
    tabs,
    labelPrefix: "test-tab",
    ...props,
  });

  return (
    <div>
      <div data-testid="tablist-wrapper" {...getTablistProps()}>
        {tabs.map((tab, idx) => {
          const tabId = typeof tab === "string" ? tab : tab.id;
          const label = typeof tab === "string" ? tab : tab.label || tab.id;
          return (
            <button key={tabId} {...getTabProps(tabId, idx)}>
              {label}
            </button>
          );
        })}
      </div>
      <div {...getPanelProps()}>
        Active panel content for {activeTab}
      </div>
    </div>
  );
}

function ControlledTestComponent() {
  const [activeTab, setActiveTab] = useState("tab2");
  const tabs = ["tab1", "tab2", "tab3"];
  const { getTablistProps, getTabProps, getPanelProps } = useTablist({
    tabs,
    activeTab,
    onTabChange: setActiveTab,
    labelPrefix: "controlled",
  });

  return (
    <div>
      <div {...getTablistProps()}>
        {tabs.map((tabId, idx) => (
          <button key={tabId} {...getTabProps(tabId, idx)}>
            {tabId}
          </button>
        ))}
      </div>
      <div {...getPanelProps(activeTab)}>
        Controlled Panel {activeTab}
      </div>
    </div>
  );
}

describe("useTablist custom hook", () => {
  it("renders with default ARIA attributes and roving tabindex", () => {
    render(<TestTablistComponent />);

    const tablist = screen.getByTestId("tablist-wrapper");
    expect(tablist).toHaveAttribute("role", "tablist");
    expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    const tab1 = screen.getByRole("tab", { name: "Tab One" });
    const tab2 = screen.getByRole("tab", { name: "Tab Two" });
    const tab4 = screen.getByRole("tab", { name: "Tab Four" });

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab1).toHaveAttribute("tabindex", "0");
    expect(tab1).toHaveAttribute("id", "test-tab-tab-tab1");
    expect(tab1).toHaveAttribute("aria-controls", "test-tab-panel-tab1");

    expect(tab2).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("tabindex", "-1");

    expect(tab4).toHaveAttribute("aria-selected", "false");
    expect(tab4).toHaveAttribute("tabindex", "-1");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "test-tab-panel-tab1");
    expect(panel).toHaveAttribute("aria-labelledby", "test-tab-tab-tab1");
    expect(panel).toHaveAttribute("tabindex", "0");
    expect(panel).toHaveTextContent("Active panel content for tab1");
  });

  it("updates active tab when a tab is clicked", () => {
    render(<TestTablistComponent />);

    const tab2 = screen.getByRole("tab", { name: "Tab Two" });
    act(() => {
      fireEvent.click(tab2);
    });

    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("tabindex", "0");

    const tab1 = screen.getByRole("tab", { name: "Tab One" });
    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab1).toHaveAttribute("tabindex", "-1");

    expect(screen.getByRole("tabpanel")).toHaveTextContent("Active panel content for tab2");
  });

  it("does not select a disabled tab on click", () => {
    render(<TestTablistComponent />);

    const tab3 = screen.getByRole("tab", { name: "Tab Three" });
    expect(tab3).toBeDisabled();

    act(() => {
      fireEvent.click(tab3);
    });

    expect(tab3).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab One" })).toHaveAttribute("aria-selected", "true");
  });

  it("handles keyboard navigation ArrowRight and ArrowLeft", () => {
    render(<TestTablistComponent />);

    const tab1 = screen.getByRole("tab", { name: "Tab One" });
    const tab2 = screen.getByRole("tab", { name: "Tab Two" });
    const tab4 = screen.getByRole("tab", { name: "Tab Four" });

    // Press ArrowRight from Tab 1 -> Tab 2
    act(() => {
      fireEvent.keyDown(tab1, { key: "ArrowRight" });
    });
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab2);

    // Press ArrowRight from Tab 2 -> Tab 4 (skipping disabled Tab 3)
    act(() => {
      fireEvent.keyDown(tab2, { key: "ArrowRight" });
    });
    expect(tab4).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab4);

    // Press ArrowRight from Tab 4 -> Tab 1 (wrap around)
    act(() => {
      fireEvent.keyDown(tab4, { key: "ArrowRight" });
    });
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab1);

    // Press ArrowLeft from Tab 1 -> Tab 4 (wrap around)
    act(() => {
      fireEvent.keyDown(tab1, { key: "ArrowLeft" });
    });
    expect(tab4).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab4);
  });

  it("handles keyboard navigation ArrowDown and ArrowUp", () => {
    render(<TestTablistComponent orientation="vertical" />);

    const tablist = screen.getByTestId("tablist-wrapper");
    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    const tab1 = screen.getByRole("tab", { name: "Tab One" });
    const tab2 = screen.getByRole("tab", { name: "Tab Two" });

    // ArrowDown -> Tab 2
    act(() => {
      fireEvent.keyDown(tab1, { key: "ArrowDown" });
    });
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab2);

    // ArrowUp -> Tab 1
    act(() => {
      fireEvent.keyDown(tab2, { key: "ArrowUp" });
    });
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab1);
  });

  it("handles Home and End keys", () => {
    render(<TestTablistComponent />);

    const tab1 = screen.getByRole("tab", { name: "Tab One" });
    const tab4 = screen.getByRole("tab", { name: "Tab Four" });

    // Press End -> Last enabled tab (Tab 4)
    act(() => {
      fireEvent.keyDown(tab1, { key: "End" });
    });
    expect(tab4).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab4);

    // Press Home -> First enabled tab (Tab 1)
    act(() => {
      fireEvent.keyDown(tab4, { key: "Home" });
    });
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(tab1);
  });

  it("supports controlled activeTab mode", () => {
    render(<ControlledTestComponent />);

    const tab1 = screen.getByRole("tab", { name: "tab1" });
    const tab2 = screen.getByRole("tab", { name: "tab2" });

    expect(tab2).toHaveAttribute("aria-selected", "true");

    act(() => {
      fireEvent.click(tab1);
    });

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Controlled Panel tab1");
  });

  it("ThemeStudio component integrates useTablist and passes accessibility ARIA checks", () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded />
      </KthemeProvider>
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();

    const customizerTab = screen.getByRole("tab", { name: "🎨 Customizer" });
    const presetsTab = screen.getByRole("tab", { name: "📱 Presets" });

    expect(customizerTab).toHaveAttribute("aria-selected", "true");
    expect(customizerTab).toHaveAttribute("tabindex", "0");
    expect(customizerTab).toHaveAttribute("id", "studio-tab-tab-customizer");
    expect(customizerTab).toHaveAttribute("aria-controls", "studio-tab-panel-customizer");

    expect(presetsTab).toHaveAttribute("aria-selected", "false");
    expect(presetsTab).toHaveAttribute("tabindex", "-1");

    const customizerPanel = screen.getByRole("tabpanel");
    expect(customizerPanel).toHaveAttribute("id", "studio-tab-panel-customizer");
    expect(customizerPanel).toHaveAttribute("aria-labelledby", "studio-tab-tab-customizer");

    // Keyboard navigation in ThemeStudio
    act(() => {
      fireEvent.keyDown(customizerTab, { key: "ArrowRight" });
    });

    expect(presetsTab).toHaveAttribute("aria-selected", "true");
    expect(document.activeElement).toBe(presetsTab);
    expect(screen.getByText("NAVY GOLD")).toBeInTheDocument();
  });
});
