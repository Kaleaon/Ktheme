import { useContext } from "react";
import { KthemeContext, KthemeContextValue } from "./KthemeContext";

export function useKtheme(): KthemeContextValue {
  const ctx = useContext(KthemeContext);
  if (!ctx) {
    throw new Error("useKtheme must be used within a <KthemeProvider>");
  }
  return ctx;
}
