import React from "react";
import "@testing-library/jest-dom";
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

  it("renders catalog cards with role='button', tabIndex=0 and responds to Enter/Space keyboard events", async () => {
    const mockComponents = [
      {
        id: "comp-1",
        name: "Test Card 1",
        framework: "jetpack-compose",
        description: "Test description 1",
      },
      {
        id: "comp-2",
        name: "Test Card 2",
        framework: "jetpack-compose",
        description: "Test description 2",
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ components: mockComponents }),
    } as unknown as Response);

    render(<CatalogSyncPanel />);

    const cards1 = await screen.findAllByText("Test Card 1");
    const card1 = cards1[0];
    const cardContainer1 = card1.closest(".catalog-item-card");

    expect(cardContainer1).not.toBeNull();
    expect(cardContainer1).toHaveAttribute("role", "button");
    expect(cardContainer1).toHaveAttribute("tabindex", "0");
    expect(cardContainer1).toHaveAttribute("aria-pressed", "true");

    const card2 = screen.getAllByText("Test Card 2")[0];
    const cardContainer2 = card2.closest(".catalog-item-card");

    expect(cardContainer2).toHaveAttribute("aria-pressed", "false");

    // Press Enter on card 2
    fireEvent.keyDown(cardContainer2!, { key: "Enter" });
    expect(cardContainer2).toHaveAttribute("aria-pressed", "true");
    expect(cardContainer1).toHaveAttribute("aria-pressed", "false");

    // Press Space on card 1
    fireEvent.keyDown(cardContainer1!, { key: " " });
    expect(cardContainer1).toHaveAttribute("aria-pressed", "true");
    expect(cardContainer2).toHaveAttribute("aria-pressed", "false");
  });
});
