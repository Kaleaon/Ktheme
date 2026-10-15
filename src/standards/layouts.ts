import data from "./layouts.v1.json";

export type LayoutId =
  | "compose"
  | "terminal"
  | "sweep"
  | "tiles"
  | "glass"
  | "rules"
  | "press";
export interface LayoutStandard {
  id: LayoutId;
  name: string;
  navigation: { phone: string; wide: string };
  corners: {
    large: number;
    panel: number;
    tile: number;
    cover: number;
    control: number;
    icon: number;
    artwork: number;
  };
  typography: {
    body: string;
    minimumMetadata: number;
    contentCase: string;
    navigationCase: string;
    mediaTracking: number;
    wrap: string;
  };
  surfaces: string;
  actions: string;
  player: string;
  shadow: string;
  referenceEffect: string | null;
  acceptance: string[];
  maximumQuickActionHeight?: number;
  frame?: {
    rail: number;
    bar: number;
    gap: number;
    inner: number;
    arm: number;
    header: number;
    elbow: number;
    footer: number;
    field: string;
    outerRadiusRule: string;
    readouts: string;
    feedback: string;
    variants: string;
    deviations: string[];
  };
}
export interface LayoutStandardsDocument {
  version: number;
  units: string;
  scope: string;
  common: {
    minimumTarget: number;
    bodyContrast: number;
    largeTextContrast: number;
    focusContrast: number;
    adaptiveWidth: number;
    contentCase: string;
    motion: string;
    status: string;
    themeLayers: string[];
  };
  layouts: Record<LayoutId, LayoutStandard>;
}

/** Versioned conventions shared by web/native consumers, independently of palette and effects. */
export const LAYOUT_STANDARDS = data as LayoutStandardsDocument;

export function getLayoutStandard(id: LayoutId): LayoutStandard {
  return LAYOUT_STANDARDS.layouts[id];
}

/** Shared curve centers require an elliptical outer sweep for an unequal rail and bar. */
export function lcarsFrameGeometry() {
  const frame = LAYOUT_STANDARDS.layouts.sweep.frame!;
  const headerTop = frame.arm + frame.gap;
  const headerBottom = headerTop + frame.header;
  const contentTop = headerBottom + frame.gap;
  return {
    ...frame,
    outerX: frame.rail + frame.inner,
    outerY: frame.bar + frame.inner,
    headerTop,
    headerBottom,
    contentTop,
    shellTop: contentTop + frame.bar,
    railTop: contentTop + frame.elbow + frame.gap,
  };
}
