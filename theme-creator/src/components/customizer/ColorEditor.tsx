import { useId } from "react";
import { useTheme } from "../../state/ThemeContext";
import { contrastRatio } from "../../utils/colors";
import AccessibleFormField from "../common/AccessibleFormField";

const COLOR_GROUPS = [
  {
    label: "Primary",
    pairs: [
      ["primary", "onPrimary"],
      ["primaryContainer", "onPrimaryContainer"],
    ],
  },
  {
    label: "Secondary",
    pairs: [
      ["secondary", "onSecondary"],
      ["secondaryContainer", "onSecondaryContainer"],
    ],
  },
  {
    label: "Tertiary",
    pairs: [
      ["tertiary", "onTertiary"],
      ["tertiaryContainer", "onTertiaryContainer"],
    ],
  },
  {
    label: "Error",
    pairs: [
      ["error", "onError"],
      ["errorContainer", "onErrorContainer"],
    ],
  },
  {
    label: "Surfaces",
    pairs: [
      ["background", "onBackground"],
      ["surface", "onSurface"],
      ["surfaceVariant", "onSurfaceVariant"],
    ],
  },
  {
    label: "Other",
    pairs: [
      ["outline", "outlineVariant"],
      ["inverseSurface", "inverseOnSurface"],
      ["inversePrimary", "scrim"],
    ],
  },
];

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export function ColorEditor() {
  const { state, dispatch } = useTheme();
  const colors = state.currentTheme.colorScheme;

  const colorBaseId = useId();
  const semanticBaseId = useId();

  function setColor(key: string, value: string) {
    dispatch({ type: "UPDATE_COLOR", payload: { key, value } });
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Colors</h3>
      {COLOR_GROUPS.map((group) => (
        <div key={group.label} className="color-group">
          <h4 className="group-label">{group.label}</h4>
          {group.pairs.map(([bg, fg]) => {
            const bgVal =
              (colors as unknown as Record<string, string>)[bg] || "#000000";
            const fgVal =
              (colors as unknown as Record<string, string>)[fg] || "#FFFFFF";
            const cr = contrastRatio(bgVal, fgVal);
            const crOk = cr >= 4.5;
            const bgId = `${colorBaseId}-${bg}`;
            const fgId = `${colorBaseId}-${fg}`;
            const contrastErrorId = `${colorBaseId}-${bg}-${fg}-contrast-error`;
            const contrastMessage = !crOk
              ? `Low contrast ratio ${cr.toFixed(1)}:1`
              : undefined;

            return (
              <div key={`${bg}-${fg}`} className="color-pair">
                <div className="color-picker-row">
                  <AccessibleFormField
                    id={bgId}
                    label={formatLabel(bg)}
                    error={contrastMessage}
                    errorId={contrastErrorId}
                    hideErrorContainer
                    hideLabel
                    className="color-picker"
                  >
                    <label className="color-picker" htmlFor={bgId}>
                      <input
                        id={bgId}
                        type="color"
                        value={bgVal}
                        onChange={(e) => setColor(bg, e.target.value)}
                      />
                      <span className="color-label">{formatLabel(bg)}</span>
                      <span className="color-hex">{bgVal}</span>
                    </label>
                  </AccessibleFormField>

                  <AccessibleFormField
                    id={fgId}
                    label={formatLabel(fg)}
                    error={contrastMessage}
                    errorId={contrastErrorId}
                    hideErrorContainer
                    hideLabel
                    className="color-picker"
                  >
                    <label className="color-picker" htmlFor={fgId}>
                      <input
                        id={fgId}
                        type="color"
                        value={fgVal}
                        onChange={(e) => setColor(fg, e.target.value)}
                      />
                      <span className="color-label">{formatLabel(fg)}</span>
                      <span className="color-hex">{fgVal}</span>
                    </label>
                  </AccessibleFormField>
                </div>
                <div
                  id={contrastErrorId}
                  className={`contrast-badge ${crOk ? "ok" : "warn"}`}
                  role={!crOk ? "alert" : undefined}
                >
                  {cr.toFixed(1)}:1 {crOk ? "AA" : "!"}
                </div>
                <div
                  className="color-swatch-preview"
                  style={{ background: bgVal, color: fgVal }}
                >
                  Sample Text
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {colors.semanticRoles && (
        <div className="color-group">
          <h4 className="group-label">Semantic roles</h4>
          {(
            [
              ["success", "onSuccess"],
              ["warning", "onWarning"],
              ["info", "onInfo"],
              ["critical", "onCritical"],
            ] as const
          ).map(([bg, fg]) => {
            const bgVal = colors.semanticRoles?.[bg] || "#000000";
            const fgVal = colors.semanticRoles?.[fg] || "#FFFFFF";
            const cr = contrastRatio(bgVal, fgVal);
            const crOk = cr >= 4.5;
            const bgId = `${semanticBaseId}-${bg}`;
            const fgId = `${semanticBaseId}-${fg}`;
            const contrastErrorId = `${semanticBaseId}-${bg}-${fg}-contrast-error`;
            const contrastMessage = !crOk
              ? `Low contrast ratio ${cr.toFixed(1)}:1`
              : undefined;

            return (
              <div className="color-pair" key={bg}>
                <div className="color-picker-row">
                  {[
                    { key: bg, id: bgId },
                    { key: fg, id: fgId },
                  ].map(({ key, id }) => (
                    <AccessibleFormField
                      key={key}
                      id={id}
                      label={formatLabel(key)}
                      error={contrastMessage}
                      errorId={contrastErrorId}
                      hideErrorContainer
                      hideLabel
                      className="color-picker"
                    >
                      <label className="color-picker" htmlFor={id}>
                        <input
                          id={id}
                          type="color"
                          value={key === bg ? bgVal : fgVal}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_THEME",
                              payload: {
                                colorScheme: {
                                  ...colors,
                                  semanticRoles: {
                                    ...colors.semanticRoles!,
                                    [key]: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                        />
                        <span className="color-label">{formatLabel(key)}</span>
                      </label>
                    </AccessibleFormField>
                  ))}
                </div>
                <div
                  id={contrastErrorId}
                  className={`contrast-badge ${crOk ? "ok" : "warn"}`}
                  role={!crOk ? "alert" : undefined}
                >
                  {cr.toFixed(1)}:1 {crOk ? "AA" : "!"}
                </div>
                <div
                  className="color-swatch-preview"
                  style={{ background: bgVal, color: fgVal }}
                >
                  Semantic status
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
