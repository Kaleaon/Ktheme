import React, { createContext, useContext, useId, useState } from "react";

export interface FormFieldContextValue {
  id: string;
  labelId: string;
  descId?: string;
  helperTextId?: string;
  errorId?: string;
  ariaDescribedBy?: string;
  ariaInvalid: boolean;
  ariaErrorMessage?: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export function useFormFieldContext() {
  return useContext(FormFieldContext);
}

let fallbackIdCounter = 0;

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  hideLabel?: boolean;
  children?: React.ReactNode;
  labelStyle?: React.CSSProperties;
}

export const FormField: React.FC<FormFieldProps> = ({
  id: explicitId,
  label,
  description,
  helperText,
  error,
  required = false,
  fullWidth = false,
  hideLabel = false,
  children,
  style,
  className = "",
  labelStyle,
  ...props
}) => {
  const reactId = typeof useId === "function" ? useId() : null;
  const [fallbackId] = useState(() => {
    fallbackIdCounter += 1;
    return `ktheme-field-${fallbackIdCounter}`;
  });

  const inputId =
    explicitId || (reactId ? `field-${reactId.replace(/:/g, "")}` : fallbackId);
  const descText = description || helperText;

  const labelId = `${inputId}-label`;
  const descId = description
    ? `${inputId}-desc`
    : helperText
      ? `${inputId}-helper`
      : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : descId;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedByParts: string[] = [];
  if (descId) describedByParts.push(descId);
  if (errorId) describedByParts.push(errorId);
  const ariaDescribedBy =
    describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const contextValue: FormFieldContextValue = {
    id: inputId,
    labelId,
    descId,
    helperTextId,
    errorId,
    ariaDescribedBy,
    ariaInvalid: Boolean(error),
    ariaErrorMessage: errorId,
  };

  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<Record<string, unknown>>;
    const elProps = (element.props || {}) as Record<string, unknown>;
    const existingDescribedBy = elProps["aria-describedby"] as string | undefined;
    const combinedDescribedBy =
      existingDescribedBy && ariaDescribedBy
        ? `${existingDescribedBy} ${ariaDescribedBy}`
        : existingDescribedBy || ariaDescribedBy;

    return React.cloneElement(element, {
      id: elProps.id || inputId,
      "aria-describedby": combinedDescribedBy,
      "aria-invalid":
        elProps["aria-invalid"] !== undefined
          ? elProps["aria-invalid"]
          : error
            ? true
            : undefined,
      "aria-errormessage":
        elProps["aria-errormessage"] || (error ? errorId : undefined),
    } as Record<string, unknown>);
  });

  const wrapperClass = [
    "ktheme-form-field",
    "form-field",
    fullWidth ? "full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div
        className={wrapperClass}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...props}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={hideLabel ? "sr-only" : "field-label"}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--ktheme-text-muted, #9ca3af)",
              cursor: "pointer",
              ...labelStyle,
            }}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                style={{
                  color: "var(--ktheme-error, #ef4444)",
                  marginLeft: "2px",
                }}
              >
                {" "}
                *
              </span>
            )}
          </label>
        )}

        {renderedChildren}

        {descText && (
          <div
            id={descId}
            className="field-helper-text"
            style={{
              fontSize: "11px",
              color: "var(--ktheme-text-muted, #9ca3af)",
              marginTop: "2px",
            }}
          >
            {descText}
          </div>
        )}

        {error && (
          <div
            id={errorId}
            role="alert"
            className="field-error"
            style={{
              fontSize: "11px",
              color: "var(--ktheme-error, #ef4444)",
              marginTop: "2px",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </FormFieldContext.Provider>
  );
};

export default FormField;

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      id: idProp,
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      "aria-errormessage": ariaErrorMessageProp,
      style,
      className = "",
      ...props
    },
    ref,
  ) {
    const context = useContext(FormFieldContext);

    const id = idProp || context?.id;
    const ariaDescribedBy = ariaDescribedByProp || context?.ariaDescribedBy;
    const ariaInvalid =
      ariaInvalidProp !== undefined ? ariaInvalidProp : context?.ariaInvalid;
    const ariaErrorMessage = ariaErrorMessageProp || context?.ariaErrorMessage;

    return (
      <input
        ref={ref}
        id={id}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-errormessage={ariaErrorMessage}
        className={`ktheme-form-input ${className}`}
        style={{
          padding: "8px 12px",
          borderRadius: "var(--radius-sm, 6px)",
          backgroundColor: "var(--ktheme-bg-elevated, #22252f)",
          border: `1px solid ${
            ariaInvalid
              ? "var(--ktheme-error, #ef4444)"
              : "var(--ktheme-border, #2e3140)"
          }`,
          color: "var(--ktheme-text, #f3f4f6)",
          fontSize: "14px",
          outline: "none",
          ...style,
        }}
        {...props}
      />
    );
  },
);

export interface FormSwitchProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onChange"> {
  checked?: boolean;
  on?: boolean;
  onChange?: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const FormSwitch = React.forwardRef<HTMLSpanElement, FormSwitchProps>(
  function FormSwitch(
    {
      checked,
      on,
      onChange,
      onClick,
      disabled = false,
      label,
      id: idProp,
      "aria-describedby": ariaDescribedByProp,
      "aria-invalid": ariaInvalidProp,
      "aria-errormessage": ariaErrorMessageProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      style,
      className = "",
      ...props
    },
    ref,
  ) {
    const context = useContext(FormFieldContext);

    const isOn = checked !== undefined ? checked : Boolean(on);
    const handleChange = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (disabled) return;
      if (onChange) onChange(!isOn);
      if (onClick) onClick(e);
    };

    const id = idProp || context?.id;
    const ariaDescribedBy = ariaDescribedByProp || context?.ariaDescribedBy;
    const ariaInvalid =
      ariaInvalidProp !== undefined ? ariaInvalidProp : context?.ariaInvalid;
    const ariaErrorMessage = ariaErrorMessageProp || context?.ariaErrorMessage;

    return (
      <span
        ref={ref}
        id={id}
        role="switch"
        aria-checked={isOn}
        tabIndex={disabled ? -1 : 0}
        onClick={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && onChange) onChange(!isOn);
          }
        }}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-errormessage={ariaErrorMessage}
        aria-label={ariaLabel || label}
        aria-labelledby={ariaLabelledBy || context?.labelId}
        className={`ktheme-form-switch ${className}`}
        style={{
          width: "42px",
          height: "24px",
          borderRadius: "12px",
          position: "relative",
          display: "inline-block",
          flex: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          backgroundColor: isOn
            ? "var(--ktheme-accent, #818cf8)"
            : "var(--ktheme-border, #2e3140)",
          transition: "background-color 0.2s ease",
          ...style,
        }}
        {...props}
      >
        <span
          style={{
            position: "absolute",
            top: "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "var(--ktheme-surface, #ffffff)",
            left: isOn ? "21px" : "3px",
            transition: "left 0.2s ease",
          }}
        />
      </span>
    );
  },
);
