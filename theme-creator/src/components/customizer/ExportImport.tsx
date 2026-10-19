import { useId, useRef, useState } from "react";
import { Download, Upload, Loader2, Archive } from "lucide-react";
import { useTheme } from "../../state/ThemeContext.tsx";
import type { KTheme } from "../../types/theme.ts";
import { FormField } from "../common/FormField.tsx";

export function ExportImport() {
  const { state, dispatch } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const importInputId = useId();
  const targetSelectId = useId();
  const zipCheckboxId = useId();

  const [selectedTarget, setSelectedTarget] = useState<string>("android");
  const [isZipPackage, setIsZipPackage] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function triggerClientDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClientJsonExport() {
    const themeName = state.currentTheme.metadata?.name || "Theme";
    const themeId = state.currentTheme.metadata?.id || "theme";
    const json = JSON.stringify(state.currentTheme, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    triggerClientDownload(blob, `${themeId}.json`);
    setStatusMessage(`${themeName} exported locally as JSON.`);
  }

  async function handleApiExport() {
    if (selectedTarget === "raw-json") {
      handleClientJsonExport();
      return;
    }

    setIsExporting(true);
    setErrorMessage("");
    setStatusMessage(
      `Exporting ${state.currentTheme.metadata?.name || "theme"} via backend service...`,
    );

    const themeId = state.currentTheme.metadata?.id || "ktheme";
    const zipQuery = isZipPackage ? "?format=zip" : "";
    const endpoint = `/api/export/${selectedTarget}${zipQuery}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isZipPackage ? { Accept: "application/zip" } : {}),
        },
        body: JSON.stringify(state.currentTheme),
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error) errorDetail = errData.error;
          if (errData.details && Array.isArray(errData.details)) {
            errorDetail += `: ${errData.details.join(", ")}`;
          }
        } catch {
          /* Ignore non-JSON error response body */
        }

        throw new Error(
          `Export service error (${response.status}): ${errorDetail}`,
        );
      }

      if (
        isZipPackage ||
        response.headers.get("content-type")?.includes("application/zip")
      ) {
        const blob = await response.blob();
        const filename = `${themeId}-${selectedTarget}.zip`;
        triggerClientDownload(blob, filename);
        setStatusMessage(
          `Successfully downloaded multi-file archive '${filename}'.`,
        );
      } else {
        const data = await response.json();
        const filename = data.filename || `${themeId}-${selectedTarget}.txt`;
        const blob = new Blob([data.code || JSON.stringify(data, null, 2)], {
          type: data.contentType || "text/plain",
        });
        triggerClientDownload(blob, filename);
        setStatusMessage(
          `Successfully exported ${selectedTarget} code as '${filename}'.`,
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Backend export API request failed:", msg);
      setErrorMessage(
        `Backend export service unreachable or failed (${msg}). Falling back to local offline JSON export.`,
      );
      setStatusMessage(
        "Backend export failed. Executing local offline JSON export fallback.",
      );
      handleClientJsonExport();
    } finally {
      setIsExporting(false);
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const theme = JSON.parse(ev.target?.result as string) as KTheme;
        if (theme.metadata?.id && theme.colorScheme?.primary) {
          dispatch({ type: "SET_THEME", payload: theme });
          setStatusMessage(
            `${theme.metadata.name || "Theme"} imported successfully.`,
          );
          setErrorMessage("");
        } else {
          setErrorMessage("Invalid theme file: missing required fields.");
          setStatusMessage("Invalid theme file.");
          alert("Invalid theme file: missing required fields");
        }
      } catch {
        setErrorMessage("Failed to parse theme JSON file.");
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
        Multi-Platform Export & Import
      </h3>

      <div className="customizer-field" style={{ marginBottom: "1rem" }}>
        <FormField id={targetSelectId} label="Target Format / Platform">
          <select
            id={targetSelectId}
            className="input-select"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            disabled={isExporting}
          >
            <option value="android">Android Jetpack Compose (.kt)</option>
            <option value="swiftui">SwiftUI Theme (.swift)</option>
            <option value="css">CSS Variables (.css)</option>
            <option value="tailwind">Tailwind CSS Config (.js)</option>
            <option value="flutter">Flutter Theme (.dart)</option>
            <option value="json">W3C Design Tokens (.json)</option>
            <option value="blender">Blender Property Group (.py)</option>
            <option value="raw-json">Raw Theme JSON (Offline Local)</option>
          </select>
        </FormField>
      </div>

      {selectedTarget !== "raw-json" && (
        <div
          className="customizer-field"
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="checkbox"
            id={zipCheckboxId}
            checked={isZipPackage}
            onChange={(e) => setIsZipPackage(e.target.checked)}
            disabled={isExporting}
          />
          <label
            htmlFor={zipCheckboxId}
            style={{
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Archive size={14} aria-hidden="true" focusable="false" />
            Package as multi-file .ZIP archive
          </label>
        </div>
      )}

      <div className="action-row">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleApiExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2
                className="animate-spin"
                size={16}
                aria-hidden="true"
                focusable="false"
              />
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} aria-hidden="true" focusable="false" />
              Export Theme
            </>
          )}
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isExporting}
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

      {errorMessage && (
        <p
          className="error-message"
          style={{
            color: "var(--ktheme-error, #ef4444)",
            fontSize: "0.85rem",
            marginTop: "0.5rem",
          }}
        >
          {errorMessage}
        </p>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </section>
  );
}
