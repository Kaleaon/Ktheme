import { Theme } from '../core/types';
import { PaperInkTheme } from './presets';

export interface ThemeFamilyPlan {
  id: string;
  name: string;
  description: string;
  signatureTraits: string[];
}

export interface ExpansionPackPlan {
  id: string;
  name: string;
  description: string;
  delivers: string[];
}

export interface UseCasePlan {
  id: string;
  name: string;
  description: string;
}

export interface BestPracticeStandard {
  id: string;
  title: string;
  standard: string;
}

export interface RecognizableUIDesign {
  id: string;
  name: string;
  signatureLayout: string;
  primaryUse: string;
}

/**
 * Strategic theme families recommended for Ktheme roadmap expansion.
 */
export const ThemeFamilyPlans: ThemeFamilyPlan[] = [
  {
    id: 'neo-minimal',
    name: 'Neo-Minimal',
    description: 'High whitespace with soft neutral surfaces and subtle depth.',
    signatureTraits: ['low-noise palettes', 'quiet elevation', 'editorial spacing']
  },
  {
    id: 'brutalist-ui',
    name: 'Brutalist UI',
    description: 'Hard-edge typography and high-contrast visual framing.',
    signatureTraits: ['hard borders', 'bold contrast', 'monospace accents']
  },
  {
    id: 'glass-frost',
    name: 'Glass & Frost',
    description: 'Translucent layers with blur and strict readability guardrails.',
    signatureTraits: ['frosted panels', 'soft highlights', 'edge glow']
  },
  {
    id: 'retro-terminal',
    name: 'Retro Terminal',
    description: 'CRT-inspired interface cues and nostalgia-focused typography.',
    signatureTraits: ['phosphor colors', 'scanline texture', 'pixel-driven details']
  },
  {
    id: 'editorial-magazine',
    name: 'Editorial / Magazine',
    description: 'Type-led layout systems with strong hierarchy and rhythm.',
    signatureTraits: ['serif display pairing', 'modular grid', 'pull-quote components']
  },
  {
    id: 'material-plus',
    name: 'Material-Plus',
    description: 'Elevation-first design with richer motion primitives.',
    signatureTraits: ['tokenized depth', 'motion scales', 'component state clarity']
  },
  {
    id: 'enterprise-calm',
    name: 'Enterprise Calm',
    description: 'Muted, data-dense interface defaults for operations tooling.',
    signatureTraits: ['low-saturation surfaces', 'dense tables', 'stable motion']
  },
  {
    id: 'playful-consumer',
    name: 'Playful Consumer',
    description: 'Rounded, expressive visual language optimized for engagement.',
    signatureTraits: ['gradient accents', 'friendly radii', 'playful iconography']
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    description: 'Deep dark palettes with metallic premium accents.',
    signatureTraits: ['rich blacks', 'gold/silver accents', 'hero-driven contrast']
  },
  {
    id: 'nature-organic',
    name: 'Nature / Organic',
    description: 'Earth-tone palettes and softer, tactile UI components.',
    signatureTraits: ['organic curves', 'mineral palettes', 'paper-like texture']
  }
];

/**
 * Planned expansion packs to accelerate practical adoption.
 */
export const ExpansionPackPlans: ExpansionPackPlan[] = [
  {
    id: 'domain-packs',
    name: 'Domain Packs',
    description: 'Verticalized theme tuning for key industries.',
    delivers: ['fintech pack', 'healthcare pack', 'education pack', 'gov pack']
  },
  {
    id: 'localization-pack',
    name: 'Localization Pack',
    description: 'Locale and writing-system aware defaults.',
    delivers: ['RTL fallbacks', 'CJK type ramps', 'script-aware spacing']
  },
  {
    id: 'accessibility-pack',
    name: 'Accessibility Pack',
    description: 'AA/AAA-certified color and focus recipes.',
    delivers: ['contrast-safe palettes', 'focus ring presets', 'high-legibility density']
  },
  {
    id: 'motion-pack',
    name: 'Motion Pack',
    description: 'Intent-led motion primitives with reduced-motion variants.',
    delivers: ['microinteraction tokens', 'easing maps', 'reduced motion overrides']
  },
  {
    id: 'data-viz-pack',
    name: 'Data Viz Pack',
    description: 'Visualization-ready color semantics and chart defaults.',
    delivers: ['chart palettes', 'series state tokens', 'annotation emphasis rules']
  },
  {
    id: 'email-docs-pack',
    name: 'Email + Docs Pack',
    description: 'Consistent theming across product and generated communications.',
    delivers: ['email-safe tokens', 'docs styling map', 'print-friendly presets']
  },
  {
    id: 'seasonal-pack',
    name: 'Seasonal / Campaign Pack',
    description: 'Time-boxed visual overlays that do not mutate base tokens.',
    delivers: ['holiday overlays', 'campaign accents', 'rollback-safe deltas']
  },
  {
    id: 'widget-skin-pack',
    name: 'Widget Skin Pack',
    description: 'Theming profiles for embedded and white-label widgets.',
    delivers: ['host-safe CSS vars', 'iframe-friendly styles', 'compact density defaults']
  },
  {
    id: 'platform-pack',
    name: 'Platform Pack',
    description: 'Token adapters for web, mobile, and desktop runtimes.',
    delivers: ['native mapping tables', 'platform defaults', 'cross-surface parity checks']
  },
  {
    id: 'ai-ui-pack',
    name: 'AI UI Pack',
    description: 'Conversation, assistant, and automation-oriented visual tokens.',
    delivers: ['chat surfaces', 'assistant card styles', 'confidence/status semantics']
  }
];

/**
 * Common product use-cases for Ktheme adoption plans.
 */
export const KthemeUseCasePlans: UseCasePlan[] = [
  {
    id: 'white-label-saas',
    name: 'White-label SaaS',
    description: 'Tenant-scoped branding with governed semantic token contracts.'
  },
  {
    id: 'post-merger-rebrand',
    name: 'Rapid rebrand after M&A',
    description: 'Token-level brand migration without full component rewrites.'
  },
  {
    id: 'public-sector-a11y',
    name: 'Accessibility-first public sector apps',
    description: 'Compliance-led defaults for procurement and citizen services.'
  },
  {
    id: 'multi-product-system',
    name: 'Multi-product design system alignment',
    description: 'Shared semantics across dashboard, docs, and admin surfaces.'
  },
  {
    id: 'low-code-theme-config',
    name: 'Theme-as-configuration for low-code builders',
    description: 'Runtime skinning for generated apps and embedded experiences.'
  }
];

export const BestPracticeStandards: BestPracticeStandard[] = [
  { id: 'semantic-first', title: 'Use semantic tokens first', standard: 'Prioritize semantic aliases over raw palette values.' },
  { id: 'token-layering', title: 'Separate core and component tokens', standard: 'Keep primitive palettes independent from component-level tokens.' },
  { id: 'contrast-budget', title: 'Lock contrast budgets', standard: 'Require AA baseline and AAA for critical workflows.' },
  { id: 'dark-mode-native', title: 'Design dark mode natively', standard: 'Ship light and dark themes with equal first-class support.' },
  { id: 'type-ramp', title: 'Define typography ramps by role', standard: 'Maintain display, heading, body, and caption scale consistency.' },
  { id: 'spacing-scale', title: 'Adopt 4/8 spacing scale', standard: 'Enforce spacing through linting and snapshot reviews.' },
  { id: 'motion-standard', title: 'Standardize motion intent', standard: 'Define duration and easing by intent class.' },
  { id: 'reduced-motion', title: 'Ship reduced-motion variants', standard: 'Every animated pattern must have an accessible fallback.' },
  { id: 'density-modes', title: 'Support density modes', standard: 'Expose comfortable, compact, and dense modes as tokens.' },
  { id: 'state-consistency', title: 'Normalize state tokens', standard: 'Maintain explicit hover, focus, pressed, and disabled semantics.' },
  { id: 'elevation-map', title: 'Use elevation maps', standard: 'Document depth hierarchy for every surface tier.' },
  { id: 'focus-visibility', title: 'Guarantee focus visibility', standard: 'Never rely on color alone for focus indicators.' },
  { id: 'versioning', title: 'Version tokens semantically', standard: 'Publish major/minor/patch changes with migrations.' },
  { id: 'runtime-fallback', title: 'Enable runtime fallback cascade', standard: 'Ensure unresolved tokens degrade predictably.' },
  { id: 'extreme-content', title: 'Test content extremes', standard: 'Validate with long strings, empty states, and error-heavy data.' },
  { id: 'contract-tests', title: 'Add theme contract tests', standard: 'Protect required token coverage with automated checks.' },
  { id: 'status-vs-brand', title: 'Decouple status and brand colors', standard: 'Keep success/warning/error independent from brand accents.' },
  { id: 'usage-guides', title: 'Document do/don’t usage', standard: 'Provide intent guidance for each token cluster.' },
  { id: 'visual-regression', title: 'Run screenshot diffs in CI', standard: 'Track cross-theme visual regressions continuously.' },
  { id: 'governance', title: 'Publish governance rules', standard: 'Define ownership, review gates, and deprecation policy.' }
];

export const RecognizableUIDesigns: RecognizableUIDesign[] = [
  { id: 'dashboard-saas', name: 'Dashboard SaaS', signatureLayout: 'KPI cards + left nav + filter toolbar', primaryUse: 'Operations and analytics products' },
  { id: 'kanban', name: 'Kanban Board', signatureLayout: 'Swimlanes with draggable cards and WIP limits', primaryUse: 'Task and project workflows' },
  { id: 'inbox-client', name: 'Inbox / Mail Client', signatureLayout: 'Thread list + message pane split view', primaryUse: 'Communication-heavy tools' },
  { id: 'chat-assistant', name: 'Chat Assistant', signatureLayout: 'Conversation stream + composer + tool result cards', primaryUse: 'AI copilots and support bots' },
  { id: 'ecommerce-storefront', name: 'E-commerce Storefront', signatureLayout: 'Hero banner + product grid + sticky cart', primaryUse: 'Direct-to-consumer shopping' },
  { id: 'checkout-flow', name: 'Checkout Flow', signatureLayout: 'Stepper + form sections + order summary rail', primaryUse: 'Payments and purchasing funnels' },
  { id: 'music-player', name: 'Music Player', signatureLayout: 'Now-playing panel + queue + transport controls', primaryUse: 'Media playback interfaces' },
  { id: 'video-streaming', name: 'Video Streaming UI', signatureLayout: 'Poster rails + detail modal + playback controls', primaryUse: 'Content discovery and playback' },
  { id: 'social-feed', name: 'Social Feed', signatureLayout: 'Composer + card feed + interaction drawer', primaryUse: 'Community and social apps' },
  { id: 'calendar-planner', name: 'Calendar Planner', signatureLayout: 'Month/week/day switch with event overlays', primaryUse: 'Scheduling and productivity' },
  { id: 'gantt-timeline', name: 'Project Timeline / Gantt', signatureLayout: 'Dependency bars + milestones + zoom axis', primaryUse: 'Program planning' },
  { id: 'crm-pipeline', name: 'CRM Pipeline', signatureLayout: 'Stage columns + deal cards + forecast widgets', primaryUse: 'Sales tracking' },
  { id: 'pos-terminal', name: 'POS Terminal', signatureLayout: 'Item keypad + cart panel + payment controls', primaryUse: 'Retail and in-person checkout' },
  { id: 'admin-console', name: 'Admin Settings Console', signatureLayout: 'Nested settings tabs + policy tables + audit logs', primaryUse: 'Configuration-heavy platforms' },
  { id: 'data-workbench', name: 'Data Table Workbench', signatureLayout: 'Pinned columns + bulk action toolbar + query strip', primaryUse: 'Analyst and back-office tooling' },
  { id: 'docs-portal', name: 'Knowledge Base / Docs Portal', signatureLayout: 'Sidebar TOC + article body + search header', primaryUse: 'Documentation products' },
  { id: 'learning-platform', name: 'Learning Platform', signatureLayout: 'Course rail + progress widgets + quiz modules', primaryUse: 'Training and LMS products' },
  { id: 'logistics-map', name: 'Logistics Map + Dispatch Panel', signatureLayout: 'Map canvas + route list + status chips', primaryUse: 'Delivery and fleet coordination' },
  { id: 'banking-shell', name: 'Banking App Shell', signatureLayout: 'Account cards + ledger list + transfer wizard', primaryUse: 'Consumer and business banking' },
  { id: 'health-portal', name: 'Health Portal', signatureLayout: 'Appointments + records cards + secure messaging', primaryUse: 'Patient and care coordination tools' }
];

/**
 * Lightweight function that maps a strategic family to an immediately usable theme.
 */
export function createThemeFromFamily(familyId: string): Theme {
  const family = ThemeFamilyPlans.find(item => item.id === familyId);
  if (!family) {
    throw new Error(`Unknown theme family: ${familyId}`);
  }

  const base = JSON.parse(JSON.stringify(PaperInkTheme)) as Theme;
  const now = new Date().toISOString();

  return {
    ...base,
    metadata: {
      ...base.metadata,
      id: `concept-${family.id}`,
      name: `${family.name} Concept`,
      description: `Roadmap concept theme for ${family.name}. ${family.description}`,
      tags: [...new Set([...(base.metadata.tags ?? []), 'concept', 'roadmap', family.id])],
      createdAt: now,
      updatedAt: now
    }
  };
}
