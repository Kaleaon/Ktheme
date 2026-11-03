/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useId } from "react";

export interface AccessibleFormFieldContextValue {
  id: string;
  ariaDescribedBy?: string;
  errorId?: string;
  helperTextId?: string;
  ariaInvalid?: boolean;
}

export const AccessibleFormFieldContext =
  createContext<AccessibleFormFieldContextValue | null>(null);

export function useAccessibleFormFieldContext() {
  return useContext(AccessibleFormFieldContext);
}

export interface AccessibleFormFieldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  hideLabel?: boolean;
  hideErrorContainer?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  errorId?: string;
  helperTextId?: string;
  labelStyle?: React.CSSProperties;
  invalid?: boolean;
}

function augmentElement(
  child: React.ReactNode,
  props: {
    id: string;
    ariaDescribedBy?: string;
    ariaInvalid?: boolean;
    ariaErrorMessage?: string;
  },
): React.ReactNode {
  if (!React.isValidElement(child)) return child;

  const element = child as React.ReactElement<Record<string, unknown>>;
  const elProps = (element.props || {}) as Record<string, unknown>;

  const isInputControl =
    typeof element.type === "string" &&
    ["input", "select", "textarea"].includes(element.type.toLowerCase());

  const existingDescribedBy = elProps["aria-describedby"] as string | undefined;
  const combinedDescribedBy =
    [existingDescribedBy, props.ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined;

  const newProps: Record<string, unknown> = {};

  if (isInputControl || elProps.id === props.id || !elProps.id) {
    if (!elProps.id) newProps.id = props.id;
    if (props.ariaDescribedBy) newProps["aria-describedby"] = combinedDescribedBy;
    if (props.ariaInvalid !== undefined) {
      newProps["aria-invalid"] =
        elProps["aria-invalid"] !== undefined
          ? elProps["aria-invalid"]
          : props.ariaInvalid;
    }
    if (props.ariaErrorMessage) {
      newProps["aria-errormessage"] =
        elProps["aria-errormessage"] || props.ariaErrorMessage;
    }
  }

  if (elProps.children) {
    const augmentedChildren = React.Children.map(
      elProps.children as React.ReactNode,
      (nestedChild) => augmentElement(nestedChild, props),
    );
    newProps.children = augmentedChildren;
  }

  return React.cloneElement(element, newProps);
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  hideLabel = false,
  hideErrorContainer = false,
  className = "",
  children,
  id: explicitId,
  errorId: explicitErrorId,
  helperTextId: explicitHelperTextId,
  style,
  labelStyle,
  invalid,
  ...props
}) => {
  const generatedId = useId();
  const inputId =
    explicitId || `accessible-field-${generatedId.replace(/:/g, "")}`;

  const helperTextId =
    explicitHelperTextId || (helperText ? `${inputId}-helper` : undefined);
  const isInvalid = Boolean(error || invalid);
  const errorId =
    explicitErrorId || (isInvalid ? `${inputId}-error` : undefined);

  const describedByParts: string[] = [];
  if (helperTextId) describedByParts.push(helperTextId);
  if (errorId && isInvalid) describedByParts.push(errorId);
  const ariaDescribedBy =
    describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const contextValue: AccessibleFormFieldContextValue = {
    id: inputId,
    ariaDescribedBy,
    errorId,
    helperTextId,
    ariaInvalid: isInvalid,
  };

  const renderedChildren = React.Children.map(children, (child) =>
    augmentElement(child, {
      id: inputId,
      ariaDescribedBy,
      ariaInvalid: isInvalid ? true : undefined,
      ariaErrorMessage: errorId,
    }),
  );

  const wrapperClass = ["form-field", fullWidth ? "full-width" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <AccessibleFormFieldContext.Provider value={contextValue}>
      <div className={wrapperClass} style={style} {...props}>
        {label && (
          <label
            htmlFor={inputId}
            className={hideLabel ? "sr-only" : "field-label"}
            style={labelStyle}
          >
            {label}
          </label>
        )}
        {renderedChildren}
        {helperText && (
          <div id={helperTextId} className="field-helper-text">
            {helperText}
          </div>
        )}
        {error && !hideErrorContainer && (
          <div
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="field-error"
          >
            {error}
          </div>
        )}
      </div>
    </AccessibleFormFieldContext.Provider>
  );
};

export default AccessibleFormField;
