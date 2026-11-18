import type { Server, IncomingMessage, ServerResponse } from "node:http";

export interface AIProviderClaudeArgs {
  apiKey: string;
  messages: Array<{ role: string; content: string }>;
}

export interface AIProviderGeminiArgs {
  apiKey: string;
  prompt: string;
  screenshots?: Array<{ mimeType: string; dataBase64: string }>;
}

export interface AIProviders {
  claude: (args: AIProviderClaudeArgs) => Promise<string>;
  gemini: (args: AIProviderGeminiArgs) => Promise<string>;
}

export interface ThemeValidationIssue {
  severity: "error" | "warning";
  message: string;
  code: string;
  path?: string;
}

export interface ValidationOutputResult {
  valid: boolean;
  errors: string[];
  issues: ThemeValidationIssue[];
  theme: Record<string, unknown> | null;
}

export interface ValidationEventLog {
  at: string;
  type: string;
  sessionId?: string;
  provider?: string;
  attempt?: number;
  retryAttempt?: number;
  errors?: string[];
  [key: string]: unknown;
}

export const providers: AIProviders;
export const sessions: Map<string, unknown>;
export const rateLimits: Map<string, unknown>;
export const interactionLogs: unknown[];
export const validationLogs: ValidationEventLog[];
export function validateThemeOutput(rawText: string): ValidationOutputResult;
export function formatCorrectionPrompt(
  errors: string[],
  issues?: ThemeValidationIssue[],
): string;
export function requestHandler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void>;
export function createServerInstance(): Server;
export const SYSTEM_PROMPT: string;
export const MAX_RETRIES: number;
export const MAX_TOTAL_TIMEOUT_MS: number;
