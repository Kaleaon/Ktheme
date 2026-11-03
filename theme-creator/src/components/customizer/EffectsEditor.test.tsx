import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { EffectsEditor } from "./EffectsEditor";
import { useTheme } from "../../state/ThemeContext";

jest.mock("../../state/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("EffectsEditor Range Slider ARIA Accessibility Tests", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        currentTheme: {
          effects: {
            metallic: {
              enabled: true,
              variant: "GOLD",
              gradient: { base: "#ffd700", highlight: "#fff8dc", shadow: "#b8860b" },
              intensity: 0.6,
            },
            shadows: {
              enabled: true,
              elevation: 4,
              blur: 8,
              color: "#00000040",
            },
            shimmer: {
              enabled: true,
              speed: 3,
              intensity: 0.5,
              angle: 135,
            },
            blur: { enabled: true, radius: 10 },
            gradients: {
              enabled: true,
              angle: 90,
              stops: [{ color: "#000000", offset: 0.5 }],
            },
            animations: { enabled: true, duration: 300, easing: "ease" },
            transitions: { enabled: true, duration: 200, properties: ["color"] },
            overlays: { enabled: true, color: "#ffffff", opacity: 0.2, blendMode: "normal" },
            focusRing: { enabled: true, color: "#818cf8", width: 2, offset: 2 },
            noise: { enabled: true, opacity: 0.05, scale: 4 },
          },
        },
      },
      dispatch: mockDispatch,
    });
  });

  it("renders metallic, shadow, and shimmer range inputs with correct ARIA attributes", () => {
    render(<EffectsEditor />);

    const metallicInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Metallic intensity"]',
    );
    expect(metallicInput).not.toBeNull();
    expect(metallicInput).toHaveAttribute("aria-valuenow", "0.6");
    expect(metallicInput).toHaveAttribute("aria-valuemin", "0");
    expect(metallicInput).toHaveAttribute("aria-valuemax", "1");
    expect(metallicInput).toHaveAttribute("aria-valuetext", "0.6");

    const shadowElevationInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Shadow elevation"]',
    );
    expect(shadowElevationInput).not.toBeNull();
    expect(shadowElevationInput).toHaveAttribute("aria-valuenow", "4");
    expect(shadowElevationInput).toHaveAttribute("aria-valuemin", "0");
    expect(shadowElevationInput).toHaveAttribute("aria-valuemax", "24");
    expect(shadowElevationInput).toHaveAttribute("aria-valuetext", "4");

    const shadowBlurInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Shadow blur"]',
    );
    expect(shadowBlurInput).not.toBeNull();
    expect(shadowBlurInput).toHaveAttribute("aria-valuenow", "8");
    expect(shadowBlurInput).toHaveAttribute("aria-valuemin", "0");
    expect(shadowBlurInput).toHaveAttribute("aria-valuemax", "48");
    expect(shadowBlurInput).toHaveAttribute("aria-valuetext", "8px");

    const shimmerSpeedInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Shimmer speed"]',
    );
    expect(shimmerSpeedInput).not.toBeNull();
    expect(shimmerSpeedInput).toHaveAttribute("aria-valuenow", "3");
    expect(shimmerSpeedInput).toHaveAttribute("aria-valuemin", "1");
    expect(shimmerSpeedInput).toHaveAttribute("aria-valuemax", "10");
    expect(shimmerSpeedInput).toHaveAttribute("aria-valuetext", "3s");

    const shimmerIntensityInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Shimmer intensity"]',
    );
    expect(shimmerIntensityInput).not.toBeNull();
    expect(shimmerIntensityInput).toHaveAttribute("aria-valuenow", "0.5");
    expect(shimmerIntensityInput).toHaveAttribute("aria-valuemin", "0");
    expect(shimmerIntensityInput).toHaveAttribute("aria-valuemax", "1");
    expect(shimmerIntensityInput).toHaveAttribute("aria-valuetext", "0.5");

    const shimmerAngleInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Shimmer angle"]',
    );
    expect(shimmerAngleInput).not.toBeNull();
    expect(shimmerAngleInput).toHaveAttribute("aria-valuenow", "135");
    expect(shimmerAngleInput).toHaveAttribute("aria-valuemin", "0");
    expect(shimmerAngleInput).toHaveAttribute("aria-valuemax", "360");
    expect(shimmerAngleInput).toHaveAttribute("aria-valuetext", "135deg");
  });

  it("renders Range helper component inputs with correct ARIA attributes", () => {
    render(<EffectsEditor />);

    const backdropRadiusInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Radius"]',
    );
    expect(backdropRadiusInput).not.toBeNull();
    expect(backdropRadiusInput).toHaveAttribute("aria-valuenow", "10");
    expect(backdropRadiusInput).toHaveAttribute("aria-valuemin", "0");
    expect(backdropRadiusInput).toHaveAttribute("aria-valuemax", "40");
    expect(backdropRadiusInput).toHaveAttribute("aria-valuetext", "10px");
  });

  it("dispatches UPDATE_EFFECTS when range input value changes", () => {
    render(<EffectsEditor />);

    const metallicInput = document.querySelector<HTMLInputElement>(
      'input[aria-label="Metallic intensity"]',
    );
    expect(metallicInput).not.toBeNull();

    fireEvent.change(metallicInput!, { target: { value: "0.8" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_EFFECTS",
      payload: expect.objectContaining({
        metallic: expect.objectContaining({ intensity: 0.8 }),
      }),
    });
  });
});
