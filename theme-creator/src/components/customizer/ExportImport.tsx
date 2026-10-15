import { useId, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useTheme } from "../../state/ThemeContext.tsx";
import type { KTheme } from "../../types/theme.ts";
import { FormField } from "../common/FormField.tsx";
import { tokensStudioToKTheme } from "../../../src/importers/tokensStudioImporter";

export function ExportImport() {
  const { state, dispatch } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const importInputId = useId();
  const [statusMessage, setStatusMessage] = useState("");

  function handleExport() {
    const json = JSON.stringify(state.currentTheme, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.currentTheme.metadata.id || "theme"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`${state.currentTheme.metadata.name} exported as JSON.`);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const rawContent = ev.target?.result as string;
        const parsed = JSON.parse(rawContent);

        if (parsed && typeof parsed === "object" && parsed.metadata?.id && parsed.colorScheme?.primary) {
          dispatch({ type: "SET_THEME", payload: parsed as KTheme });
          setStatusMessage(`${parsed.metadata.name || "Theme"} imported.`);
        } else {
          // Attempt Tokens Studio / DTCG conversion
          const converted = tokensStudioToKTheme(parsed, {
            themeName: file.name.replace(/\.[^/.]+$/, ""),
          });
          if (converted && converted.colorScheme?.primary) {
            dispatch({ type: "SET_THEME", payload: converted as KTheme });
            setStatusMessage(`${converted.metadata.name || "Tokens Studio Theme"} imported.`);
          } else {
            setStatusMessage("Invalid theme file: missing required fields.");
            alert("Invalid theme file: missing required fields");
          }
        }
      } catch {
        setStatusMessage("Failed to parse theme file.");
        alert("Failed to parse theme file");
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <section className="editor-section" aria-labelledby="import-export-title">
      <h3 className="section-title" id="import-export-title">
        Import / Export
      </h3>
      <div className="action-row">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleExport}
        >
          <Download size={16} aria-hidden="true" focusable="false" />
          Export JSON
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={16} aria-hidden="true" focusable="false" />
          Import JSON
        </button>
        <FormField id={importInputId} label="Import theme JSON file" hideLabel>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </FormField>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </section>
  );
}
