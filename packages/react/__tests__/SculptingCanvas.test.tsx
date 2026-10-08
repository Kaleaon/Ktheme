import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SculptingCanvas } from "../src/SculptingCanvas";

describe("SculptingCanvas", () => {
  const sampleMeshData = {
    positions: new Float32Array([
      -1, -1, 0,
       1, -1, 0,
       0,  1, 0,
    ]),
    normals: new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]),
    indices: new Uint32Array([0, 1, 2]),
  };

  it("renders canvas and controls overlay correctly", () => {
    render(<SculptingCanvas meshData={sampleMeshData} />);

    expect(screen.getByTestId("sculpting-canvas-container")).toBeInTheDocument();
    expect(screen.getByTestId("sculpting-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("sculpting-controls-overlay")).toBeInTheDocument();

    // Mode buttons
    expect(screen.getByTestId("mode-btn-push")).toBeInTheDocument();
    expect(screen.getByTestId("mode-btn-pull")).toBeInTheDocument();
    expect(screen.getByTestId("mode-btn-smooth")).toBeInTheDocument();

    // Falloff buttons
    expect(screen.getByTestId("falloff-btn-gaussian")).toBeInTheDocument();
    expect(screen.getByTestId("falloff-btn-smoothstep")).toBeInTheDocument();

    // Sliders
    expect(screen.getByTestId("radius-slider")).toBeInTheDocument();
    expect(screen.getByTestId("strength-slider")).toBeInTheDocument();
  });

  it("dispatches raycast and brush stroke when dragging over mesh", () => {
    const mockRaycast = jest.fn().mockReturnValue({
      hit: true,
      point: [0, 0, 0],
      normal: [0, 0, 1],
      face_index: 0,
      distance: 5.0,
    });

    const mockApplyBrush = jest.fn().mockReturnValue(
      new Float32Array([-1, -1, 0, 1, -1, 0, 0, 1, 0.5])
    );

    const mockEngine = {
      raycast_mesh: mockRaycast,
      apply_brush_stroke: mockApplyBrush,
    };

    const handleMeshChange = jest.fn();

    render(
      <SculptingCanvas
        engine={mockEngine}
        meshData={sampleMeshData}
        onMeshChange={handleMeshChange}
      />
    );

    const canvas = screen.getByTestId("sculpting-canvas");

    // Pointer move over center of canvas
    fireEvent.pointerMove(canvas, {
      clientX: 400,
      clientY: 250,
      buttons: 0,
    });

    expect(mockRaycast).toHaveBeenCalled();

    // Pointer down and drag
    fireEvent.pointerDown(canvas, {
      clientX: 400,
      clientY: 250,
      pointerId: 1,
      buttons: 1,
    });

    expect(mockApplyBrush).toHaveBeenCalled();
    expect(handleMeshChange).toHaveBeenCalled();

    const [, , , radius, strength, mode, falloff] = mockApplyBrush.mock.calls[0];
    expect(radius).toBe(0.2);
    expect(strength).toBe(0.5);
    expect(mode).toBe("push");
    expect(falloff).toBe("gaussian");
  });

  it("allows interactive adjustment of brush controls", () => {
    const mockApplyBrush = jest.fn().mockReturnValue(sampleMeshData.positions);
    const mockEngine = {
      raycast_mesh: jest.fn().mockReturnValue({
        hit: true,
        point: [0, 0, 0],
        normal: [0, 0, 1],
        face_index: 0,
        distance: 5,
      }),
      apply_brush_stroke: mockApplyBrush,
    };

    render(<SculptingCanvas engine={mockEngine} meshData={sampleMeshData} />);

    // Switch mode to pull
    fireEvent.click(screen.getByTestId("mode-btn-pull"));

    // Switch falloff to smoothstep
    fireEvent.click(screen.getByTestId("falloff-btn-smoothstep"));

    // Adjust radius slider
    const radiusSlider = screen.getByTestId("radius-slider");
    fireEvent.change(radiusSlider, { target: { value: "0.45" } });

    // Adjust strength slider
    const strengthSlider = screen.getByTestId("strength-slider");
    fireEvent.change(strengthSlider, { target: { value: "0.80" } });

    // Pointer down stroke
    const canvas = screen.getByTestId("sculpting-canvas");
    fireEvent.pointerDown(canvas, {
      clientX: 400,
      clientY: 250,
      pointerId: 1,
      buttons: 1,
    });

    expect(mockApplyBrush).toHaveBeenCalledWith(
      0, 0, 0,
      0.45,
      0.80,
      "pull",
      "smoothstep",
      0, 0, 1
    );
  });
});
