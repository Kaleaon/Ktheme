import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CatalogSyncPanel } from "./CatalogSyncPanel";

describe("CatalogSyncPanel Accessibility Tests", () => {
  it("binds aria-pressed to framework filter buttons", () => {
    render(<CatalogSyncPanel />);

    const allFilterBtn = screen.getByRole("button", { name: /All/i });
    const composeFilterBtn = screen.getByRole("button", { name: "Compose" });
    const blenderFilterBtn = screen.getByRole("button", { name: "Blender UI" });

    expect(allFilterBtn.getAttribute("aria-pressed")).toBe("true");
    expect(composeFilterBtn.getAttribute("aria-pressed")).toBe("false");
    expect(blenderFilterBtn.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(composeFilterBtn);

    expect(allFilterBtn.getAttribute("aria-pressed")).toBe("false");
    expect(composeFilterBtn.getAttribute("aria-pressed")).toBe("true");
    expect(blenderFilterBtn.getAttribute("aria-pressed")).toBe("false");
  });
});
