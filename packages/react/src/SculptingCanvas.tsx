import React, { useCallback, useEffect, useRef, useState } from "react";

export type SculptMode = "push" | "pull" | "smooth";
export type FalloffCurve = "gaussian" | "smoothstep";

export interface MeshData {
  positions: Float32Array | number[];
  normals?: Float32Array | number[];
  uvs?: Float32Array | number[];
  indices: Uint32Array | number[];
}

export interface WasmEngineLike {
  raycast_mesh?: (
    originX: number,
    originY: number,
    originZ: number,
    dirX: number,
    dirY: number,
    dirZ: number
  ) => Record<string, unknown> | null;
  apply_brush_stroke?: (
    centerX: number,
    centerY: number,
    centerZ: number,
    radius: number,
    strength: number,
    mode: string,
    falloff: string,
    dirX: number,
    dirY: number,
    dirZ: number
  ) => Float32Array;
  get_normals?: () => Float32Array;
}

export interface SculptingCanvasProps {
  engine?: WasmEngineLike | null;
  meshData?: MeshData;
  brushRadius?: number;
  brushStrength?: number;
  brushMode?: SculptMode;
  brushFalloff?: FalloffCurve;
  onMeshChange?: (positions: Float32Array, normals?: Float32Array) => void;
  camera?: {
    position?: [number, number, number];
    target?: [number, number, number];
    fov?: number;
  };
  showControls?: boolean;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export interface RaycastHit {
  hit: boolean;
  point: [number, number, number];
  normal: [number, number, number];
  face_index: number;
  distance: number;
}

export const SculptingCanvas: React.FC<SculptingCanvasProps> = ({
  engine,
  meshData,
  brushRadius: initialRadius = 0.2,
  brushStrength: initialStrength = 0.5,
  brushMode: initialMode = "push",
  brushFalloff: initialFalloff = "gaussian",
  onMeshChange,
  camera = { position: [0, 0, 5], target: [0, 0, 0], fov: 45 },
  showControls = true,
  width = "100%",
  height = 500,
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Brush controls state
  const [radius, setRadius] = useState<number>(initialRadius);
  const [strength, setStrength] = useState<number>(initialStrength);
  const [mode, setMode] = useState<SculptMode>(initialMode);
  const [falloff, setFalloff] = useState<FalloffCurve>(initialFalloff);

  // Hit test & cursor state
  const [cursorHit, setCursorHit] = useState<RaycastHit | null>(null);
  const [cursorScreenPos, setCursorScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Internal mesh positions state
  const meshPositionsRef = useRef<Float32Array>(
    meshData
      ? Float32Array.from(meshData.positions)
      : new Float32Array([
          -1, -1, 0, 1, -1, 0, 0, 1, 0,
        ])
  );
  const meshIndicesRef = useRef<Uint32Array>(
    meshData ? Uint32Array.from(meshData.indices) : new Uint32Array([0, 1, 2])
  );

  useEffect(() => {
    if (meshData) {
      meshPositionsRef.current = Float32Array.from(meshData.positions);
      meshIndicesRef.current = Uint32Array.from(meshData.indices);
    }
  }, [meshData]);

  // Project screen coordinates to 3D camera ray
  const screenToRay = useCallback(
    (canvasX: number, canvasY: number, canvasWidth: number, canvasHeight: number) => {
      const ndcX = (2 * canvasX) / canvasWidth - 1;
      const ndcY = 1 - (2 * canvasY) / canvasHeight;

      const camPos = camera.position || [0, 0, 5];
      const fovRad = ((camera.fov || 45) * Math.PI) / 180;
      const aspect = canvasWidth / canvasHeight;

      const tanHalfFov = Math.tan(fovRad / 2);
      const dirX = ndcX * tanHalfFov * aspect;
      const dirY = ndcY * tanHalfFov;
      const dirZ = -1;

      const len = Math.hypot(dirX, dirY, dirZ);
      return {
        origin: camPos,
        direction: [dirX / len, dirY / len, dirZ / len] as [number, number, number],
      };
    },
    [camera]
  );

  // Perform raycast against WASM engine or fallback JS raycast
  const doRaycast = useCallback(
    (rayOrigin: [number, number, number], rayDir: [number, number, number]): RaycastHit => {
      if (engine && typeof engine.raycast_mesh === "function") {
        const res = engine.raycast_mesh(
          rayOrigin[0],
          rayOrigin[1],
          rayOrigin[2],
          rayDir[0],
          rayDir[1],
          rayDir[2]
        );
        if (res && typeof res === "object") {
          return {
            hit: Boolean(res.hit),
            point: (res.point as [number, number, number]) || [0, 0, 0],
            normal: (res.normal as [number, number, number]) || [0, 0, 1],
            face_index: (res.face_index as number) || 0,
            distance: (res.distance as number) || 0,
          };
        }
      }

      // Pure JS fallback raycast for simple testing/interactive feedback
      const positions = meshPositionsRef.current;
      const indices = meshIndicesRef.current;
      let closestHit: RaycastHit | null = null;
      let minDistance = Infinity;

      for (let i = 0; i < indices.length; i += 3) {
        const i0 = indices[i] * 3;
        const i1 = indices[i + 1] * 3;
        const i2 = indices[i + 2] * 3;

        const v0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
        const v1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
        const v2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];

        // Triangle normal
        const e1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        const e2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
        const norm = [
          e1[1] * e2[2] - e1[2] * e2[1],
          e1[2] * e2[0] - e1[0] * e2[2],
          e1[0] * e2[1] - e1[1] * e2[0],
        ];
        const nLen = Math.hypot(norm[0], norm[1], norm[2]);
        if (nLen < 1e-6) continue;
        const nNorm = [norm[0] / nLen, norm[1] / nLen, norm[2] / nLen] as [number, number, number];

        // Ray-plane intersection
        const denom = rayDir[0] * nNorm[0] + rayDir[1] * nNorm[1] + rayDir[2] * nNorm[2];
        if (Math.abs(denom) < 1e-6) continue;

        const t =
          ((v0[0] - rayOrigin[0]) * nNorm[0] +
            (v0[1] - rayOrigin[1]) * nNorm[1] +
            (v0[2] - rayOrigin[2]) * nNorm[2]) /
          denom;

        if (t > 0 && t < minDistance) {
          const hitPt: [number, number, number] = [
            rayOrigin[0] + rayDir[0] * t,
            rayOrigin[1] + rayDir[1] * t,
            rayOrigin[2] + rayDir[2] * t,
          ];
          minDistance = t;
          closestHit = {
            hit: true,
            point: hitPt,
            normal: nNorm,
            face_index: Math.floor(i / 3),
            distance: t,
          };
        }
      }

      return closestHit || { hit: false, point: [0, 0, 0], normal: [0, 0, 1], face_index: 0, distance: 0 };
    },
    [engine]
  );

  // Perform brush stroke deformation
  const dispatchBrushStroke = useCallback(
    (hitPoint: [number, number, number], hitNormal: [number, number, number]) => {
      let updatedPositions: Float32Array;
      let updatedNormals: Float32Array | undefined;

      if (engine && typeof engine.apply_brush_stroke === "function") {
        updatedPositions = engine.apply_brush_stroke(
          hitPoint[0],
          hitPoint[1],
          hitPoint[2],
          radius,
          strength,
          mode,
          falloff,
          hitNormal[0],
          hitNormal[1],
          hitNormal[2]
        );
        if (typeof engine.get_normals === "function") {
          updatedNormals = engine.get_normals();
        }
      } else {
        // Fallback JS displacement
        const positions = new Float32Array(meshPositionsRef.current);
        const radiusSq = radius * radius;

        for (let i = 0; i < positions.length; i += 3) {
          const dx = positions[i] - hitPoint[0];
          const dy = positions[i + 1] - hitPoint[1];
          const dz = positions[i + 2] - hitPoint[2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq <= radiusSq) {
            const dist = Math.sqrt(distSq);
            const t = Math.min(dist / radius, 1.0);
            let w = 0;
            if (falloff === "smoothstep") {
              w = 1.0 - (3 * t * t - 2 * t * t * t);
            } else {
              const eNeg3 = Math.exp(-3);
              w = Math.max(0, (Math.exp(-3 * t * t) - eNeg3) / (1 - eNeg3));
            }

            const factor = strength * w;
            const dir = mode === "pull" ? -1 : 1;

            if (mode === "smooth") {
              positions[i] += (hitPoint[0] - positions[i]) * factor * 0.5;
              positions[i + 1] += (hitPoint[1] - positions[i + 1]) * factor * 0.5;
              positions[i + 2] += (hitPoint[2] - positions[i + 2]) * factor * 0.5;
            } else {
              positions[i] += hitNormal[0] * factor * dir;
              positions[i + 1] += hitNormal[1] * factor * dir;
              positions[i + 2] += hitNormal[2] * factor * dir;
            }
          }
        }
        updatedPositions = positions;
      }

      meshPositionsRef.current = updatedPositions;
      if (onMeshChange) {
        onMeshChange(updatedPositions, updatedNormals);
      }
    },
    [engine, radius, strength, mode, falloff, onMeshChange]
  );

  // Render 3D Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background grid
    ctx.fillStyle = "#1e1e24";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#2e2e38";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render 3D wireframe mesh
    const positions = meshPositionsRef.current;
    const indices = meshIndicesRef.current;
    const fovRad = ((camera.fov || 45) * Math.PI) / 180;
    const aspect = canvas.width / canvas.height;
    const tanHalfFov = Math.tan(fovRad / 2);
    const camZ = (camera.position || [0, 0, 5])[2];

    const project = (x: number, y: number, z: number) => {
      const pZ = camZ - z;
      if (pZ <= 0.1) return null;
      const screenX = (x / (pZ * tanHalfFov * aspect) + 1) * 0.5 * canvas.width;
      const screenY = (1 - y / (pZ * tanHalfFov)) * 0.5 * canvas.height;
      return { x: screenX, y: screenY };
    };

    ctx.strokeStyle = "#4f46e5";
    ctx.fillStyle = "rgba(79, 70, 229, 0.15)";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < indices.length; i += 3) {
      const i0 = indices[i] * 3;
      const i1 = indices[i + 1] * 3;
      const i2 = indices[i + 2] * 3;

      const p0 = project(positions[i0], positions[i0 + 1], positions[i0 + 2]);
      const p1 = project(positions[i1], positions[i1 + 1], positions[i1 + 2]);
      const p2 = project(positions[i2], positions[i2 + 1], positions[i2 + 2]);

      if (p0 && p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // Render 3D cursor ring at raycast hit point
    if (cursorHit && cursorHit.hit && cursorScreenPos) {
      const ringRadiusPx = (radius * canvas.height) / (camZ * tanHalfFov * 2);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cursorScreenPos.x, cursorScreenPos.y, Math.max(8, ringRadiusPx), 0, Math.PI * 2);
      ctx.strokeStyle = mode === "push" ? "#22c55e" : mode === "pull" ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cursorScreenPos.x, cursorScreenPos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    }
  }, [camera, cursorHit, cursorScreenPos, radius, mode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Pointer event handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorScreenPos({ x, y });

    const ray = screenToRay(x, y, canvas.width, canvas.height);
    const hit = doRaycast(ray.origin, ray.direction);
    setCursorHit(hit);

    if (isDragging && hit.hit) {
      dispatchBrushStroke(hit.point, hit.normal);
      drawCanvas();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    if (typeof e.currentTarget.setPointerCapture === "function") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (_err) {
        // Pointer capture may fail in synthetic/test environments
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ray = screenToRay(x, y, canvas.width, canvas.height);
    const hit = doRaycast(ray.origin, ray.direction);
    setCursorHit(hit);

    if (hit.hit) {
      dispatchBrushStroke(hit.point, hit.normal);
      drawCanvas();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_err) {
      // Pointer capture release may fail if capture was not set
    }
  };

  return (
    <div
      className={`sculpting-canvas-container ${className || ""}`}
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        flexDirection: "column",
        background: "#121216",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #2a2a32",
        boxSizing: "border-box",
        userSelect: "none",
        ...style,
      }}
      data-testid="sculpting-canvas-container"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: cursorHit?.hit ? "crosshair" : "default",
          touchAction: "none",
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          setCursorHit(null);
          setCursorScreenPos(null);
          setIsDragging(false);
        }}
        data-testid="sculpting-canvas"
      />

      {/* Interactive Brush Controls Overlay */}
      {showControls && (
        <div
          className="sculpting-controls-overlay"
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(18, 18, 22, 0.85)",
            backdropFilter: "blur(8px)",
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#e2e8f0",
            fontSize: 13,
            fontFamily: "system-ui, -apple-system, sans-serif",
            zIndex: 10,
          }}
          data-testid="sculpting-controls-overlay"
        >
          {/* Mode Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, color: "#94a3b8" }}>Mode:</span>
            {(["push", "pull", "smooth"] as SculptMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "none",
                  background: mode === m ? "#4f46e5" : "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "background 0.15s",
                }}
                data-testid={`mode-btn-${m}`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Falloff Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, color: "#94a3b8" }}>Falloff:</span>
            {(["gaussian", "smoothstep"] as FalloffCurve[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFalloff(f)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "none",
                  background: falloff === f ? "#0284c7" : "rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "background 0.15s",
                }}
                data-testid={`falloff-btn-${f}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Radius Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap" }}>
              Radius: {radius.toFixed(2)}
            </span>
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.01}
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#4f46e5", cursor: "pointer" }}
              data-testid="radius-slider"
            />
          </div>

          {/* Strength Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <span style={{ fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap" }}>
              Strength: {strength.toFixed(2)}
            </span>
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.01}
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: "#4f46e5", cursor: "pointer" }}
              data-testid="strength-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};
