import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KChip, KNavRail, KToggle, KInput, KDialog, KSlider } from "./DCs";
import { LinkpointUIKit } from "../linkpoint/LinkpointUIKit";
import { IconicShowcaseGallery } from "./IconicShowcaseGallery";

describe("Accessibility ARIA State Binding Tests", () => {
  describe("KChip Component", () => {
    it("renders as button element with aria-pressed attribute based on active prop", () => {
      const { rerender } = render(<KChip label="Active Chip" active={true} />);
      const chipBtn = screen.getByRole("button", { name: "Active Chip" });

      expect(chipBtn.tagName).toBe("BUTTON");
      expect(chipBtn.getAttribute("type")).toBe("button");
      expect(chipBtn.getAttribute("aria-pressed")).toBe("true");

      rerender(<KChip label="Active Chip" active={false} />);
      expect(chipBtn.getAttribute("aria-pressed")).toBe("false");
    });

    it('renders delete icon with role="button", tabIndex=0, aria-label, and handles keyboard Enter/Space', () => {
      const handleDelete = jest.fn();
      render(<KChip label="Deletable Chip" onDelete={handleDelete} />);

      const deleteIcon = screen.getByRole("button", {
        name: "Remove Deletable Chip",
      });
      expect(deleteIcon.getAttribute("tabIndex")).toBe("0");

      fireEvent.keyDown(deleteIcon, { key: "Enter" });
      expect(handleDelete).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(deleteIcon, { key: " " });
      expect(handleDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe("KInput Component", () => {
    it("associates label with input via htmlFor and auto-generated ID", () => {
      render(<KInput label="Email Address" />);
      const inputEl = screen.getByLabelText("Email Address");
      expect(inputEl).toBeDefined();
      expect(inputEl.getAttribute("id")).toBeDefined();
      expect(inputEl.getAttribute("id")).not.toBe("");

      const labelEl = screen.getByText("Email Address") as HTMLLabelElement;
      expect(labelEl.getAttribute("for")).toBe(inputEl.getAttribute("id"));
    });

    it("uses explicit id when provided", () => {
      render(<KInput id="custom-email-id" label="Email Address" />);
      const inputEl = screen.getByLabelText("Email Address");
      expect(inputEl.getAttribute("id")).toBe("custom-email-id");
      const labelEl = screen.getByText("Email Address") as HTMLLabelElement;
      expect(labelEl.getAttribute("for")).toBe("custom-email-id");
    });

    it("sets aria-invalid, aria-describedby, and aria-errormessage when error is present", () => {
      render(<KInput label="Email" error="Invalid email address" />);
      const inputEl = screen.getByLabelText("Email");
      const errorMsg = screen.getByRole("alert");

      expect(inputEl.getAttribute("aria-invalid")).toBe("true");
      expect(errorMsg.textContent).toBe("Invalid email address");
      const errorId = errorMsg.getAttribute("id");
      expect(errorId).toBeTruthy();
      expect(inputEl.getAttribute("aria-describedby")).toBe(errorId);
      expect(inputEl.getAttribute("aria-errormessage")).toBe(errorId);
    });

    it('sets aria-invalid="false" and removes describedby/errormessage when no error', () => {
      render(<KInput label="Username" />);
      const inputEl = screen.getByLabelText("Username");
      expect(inputEl.getAttribute("aria-invalid")).toBe("false");
      expect(inputEl.getAttribute("aria-describedby")).toBeNull();
      expect(inputEl.getAttribute("aria-errormessage")).toBeNull();
    });
  });

  describe("KNavRail Component", () => {
    it('renders inside a nav element and uses aria-current="page" on active item', () => {
      const items = [
        { id: "home", label: "Home" },
        { id: "settings", label: "Settings" },
      ];
      render(<KNavRail items={items} activeId="home" onSelect={() => {}} />);

      const navEl = screen.getByRole("navigation", {
        name: "Sidebar Navigation",
      });
      expect(navEl).toBeInTheDocument();

      const homeBtn = screen.getByRole("button", { name: /Home/i });
      const settingsBtn = screen.getByRole("button", { name: /Settings/i });

      expect(homeBtn.getAttribute("type")).toBe("button");
      expect(homeBtn.getAttribute("aria-current")).toBe("page");
      expect(settingsBtn.getAttribute("aria-current")).toBeNull();
      expect(homeBtn.getAttribute("aria-selected")).toBeNull();
    });
  });

  describe("KToggle Component", () => {
    it('renders a button element with role="switch" and aria-checked attribute', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <KToggle checked={true} onChange={handleChange} label="Dark Mode" />,
      );

      const switchBtn = screen.getByRole("switch");
      expect(switchBtn.tagName).toBe("BUTTON");
      expect(switchBtn.getAttribute("type")).toBe("button");
      expect(switchBtn.getAttribute("aria-checked")).toBe("true");

      fireEvent.click(switchBtn);
      expect(handleChange).toHaveBeenCalledWith(false);

      rerender(
        <KToggle checked={false} onChange={handleChange} label="Dark Mode" />,
      );
      expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    });

    it("uses a div container instead of label and associates label span via aria-labelledby", () => {
      const handleChange = jest.fn();
      const { container } = render(
        <KToggle
          checked={false}
          onChange={handleChange}
          label="Enable Notifications"
        />,
      );

      const wrapperDiv = container.firstChild as HTMLElement;
      expect(wrapperDiv.tagName).toBe("DIV");

      const labelSpan = screen.getByText("Enable Notifications");
      expect(labelSpan.tagName).toBe("SPAN");

      const labelId = labelSpan.getAttribute("id");
      expect(labelId).toBeTruthy();

      const switchBtn = screen.getByRole("switch");
      expect(switchBtn.getAttribute("aria-labelledby")).toBe(labelId);

      fireEvent.click(labelSpan);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("provides aria-label fallback when label prop is not provided", () => {
      render(<KToggle checked={false} onChange={() => {}} />);
      const switchBtn = screen.getByRole("switch");
      expect(switchBtn.getAttribute("aria-label")).toBe("Toggle switch");
    });
  });

  describe("KDialog Component", () => {
    it('renders role="dialog", aria-modal="true", and links title and description', () => {
      render(
        <KDialog
          isOpen={true}
          title="Delete Item"
          description="Are you sure you want to delete this item?"
          onClose={() => {}}
        />,
      );

      const dialogEl = screen.getByRole("dialog");
      expect(dialogEl.getAttribute("aria-modal")).toBe("true");

      const titleEl = screen.getByRole("heading", { name: "Delete Item" });
      const titleId = titleEl.getAttribute("id");
      expect(titleId).toBeTruthy();
      expect(dialogEl.getAttribute("aria-labelledby")).toBe(titleId);

      const descEl = screen.getByText(
        "Are you sure you want to delete this item?",
      );
      const descId = descEl.getAttribute("id");
      expect(descId).toBeTruthy();
      expect(dialogEl.getAttribute("aria-describedby")).toBe(descId);
    });

    it("invokes onClose when Escape key is pressed or backdrop is clicked", () => {
      const handleClose = jest.fn();
      render(
        <KDialog isOpen={true} title="Confirm Action" onClose={handleClose} />,
      );

      fireEvent.keyDown(window, { key: "Escape" });
      expect(handleClose).toHaveBeenCalledTimes(1);

      const backdropEl = screen.getByRole("dialog")
        .parentElement as HTMLElement;
      fireEvent.click(backdropEl);
      expect(handleClose).toHaveBeenCalledTimes(2);
    });

    it("focuses first focusable element in dialog when opened", () => {
      render(
        <KDialog isOpen={true} title="Focused Dialog" onClose={() => {}} />,
      );

      const cancelBtn = screen.getByRole("button", { name: "Cancel" });
      expect(document.activeElement).toBe(cancelBtn);
    });
  });

  describe("KSlider Component", () => {
    it("renders range input with aria-labelledby when label is provided", () => {
      render(<KSlider value={50} label="Volume" onChange={() => {}} />);

      const sliderEl = screen.getByRole("slider", { name: "Volume" });
      expect(sliderEl.getAttribute("type")).toBe("range");

      const labelEl = screen.getByText("Volume");
      const labelId = labelEl.getAttribute("id");
      expect(labelId).toBeTruthy();
      expect(sliderEl.getAttribute("aria-labelledby")).toBe(labelId);
    });

    it("uses aria-label fallback when no label is provided", () => {
      render(<KSlider value={30} onChange={() => {}} />);

      const sliderEl = screen.getByRole("slider", { name: "Slider" });
      expect(sliderEl.getAttribute("aria-label")).toBe("Slider");
    });
  });

  describe("LinkpointUIKit Component", () => {
    it("binds aria-pressed to device size and layout pack switcher buttons", () => {
      render(<LinkpointUIKit />);

      const desktopBtn = screen.getByRole("button", { name: "DESKTOP" });
      const tabletBtn = screen.getByRole("button", { name: "TABLET" });
      const mobileBtn = screen.getByRole("button", { name: "MOBILE" });

      expect(desktopBtn.getAttribute("aria-pressed")).toBe("true");
      expect(tabletBtn.getAttribute("aria-pressed")).toBe("false");
      expect(mobileBtn.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(mobileBtn);

      expect(desktopBtn.getAttribute("aria-pressed")).toBe("false");
      expect(mobileBtn.getAttribute("aria-pressed")).toBe("true");

      const standardPackBtn = screen.getByRole("button", { name: "standard" });
      const compactPackBtn = screen.getByRole("button", { name: "compact" });

      expect(standardPackBtn.getAttribute("aria-pressed")).toBe("true");
      expect(compactPackBtn.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(compactPackBtn);
      expect(standardPackBtn.getAttribute("aria-pressed")).toBe("false");
      expect(compactPackBtn.getAttribute("aria-pressed")).toBe("true");
    });
  });

  describe("IconicShowcaseGallery Component", () => {
    it("binds aria-pressed to pack selector and variant switcher buttons", () => {
      render(<IconicShowcaseGallery />);

      const lcarsBtn = screen.getByRole("button", {
        name: "LCARS Activation Pack",
      });
      const metroBtn = screen.getByRole("button", {
        name: "Windows Activation Pack",
      });

      expect(lcarsBtn.getAttribute("aria-pressed")).toBe("true");
      expect(metroBtn.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(metroBtn);
      expect(lcarsBtn.getAttribute("aria-pressed")).toBe("false");
      expect(metroBtn.getAttribute("aria-pressed")).toBe("true");

      const darkVariantBtn = screen.getByRole("button", { name: "dark" });
      const lightVariantBtn = screen.getByRole("button", { name: "light" });

      expect(darkVariantBtn.getAttribute("aria-pressed")).toBe("true");
      expect(lightVariantBtn.getAttribute("aria-pressed")).toBe("false");

      fireEvent.click(lightVariantBtn);
      expect(darkVariantBtn.getAttribute("aria-pressed")).toBe("false");
      expect(lightVariantBtn.getAttribute("aria-pressed")).toBe("true");
    });
  });
});
