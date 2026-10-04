import { NormalizedThemeTokens } from '../ir/tokenIR';

/**
 * Interface for declarative platform renderers consuming the canonical IR.
 */
export interface TokenRenderer<T = unknown> {
  readonly id: string;
  readonly name: string;
  render(tokens: NormalizedThemeTokens): T;
}
