import React, { createContext, useContext, useId } from "react";

export interface FormFieldContextValue {
  id: string;
  ariaDescribedBy?: string;
  errorId?: string;
  helperTextId?: string;
  ariaInvalid?: boolean;
  required?: boolean;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null,
);

export function useFormFieldContext() {
  return useContext(FormFieldContext);
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  error?: React.ReactNode;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  hideLabel?: boolean;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  labelStyle?: React.CSSProperties;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  hideLabel = false,
  className = "",
  children,
  id: explicitId,
  style,
  labelStyle,
  required = false,
  ...props
}) => {
  const generatedId = useId();
  const inputId = explicitId || `field-${generatedId.replace(/:/g, "")}`;

  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedByParts: string[] = [];
  if (helperTextId) describedByParts.push(helperTextId);
  if (errorId) describedByParts.push(errorId);
  const ariaDescribedBy =
    describedByParts.length > 0 ? describedByParts.join(" ") : undefined;

  const contextValue: FormFieldContextValue = {
    id: inputId,
    ariaDescribedBy,
    errorId,
    helperTextId,
    ariaInvalid: Boolean(error),
    required,
  };

  const renderedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{
      id?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "grammar" | "spelling";
      "aria-errormessage"?: string;
      "aria-required"?: boolean;
    }>;
    const existingDescribedBy = element.props["aria-describedby"];
    const combinedDescribedBy =
      [existingDescribedBy, ariaDescribedBy].filter(Boolean).join(" ") ||
      undefined;

    return React.cloneElement(element, {
      id: element.props.id || inputId,
      "aria-describedby": combinedDescribedBy,
      "aria-invalid":
        element.props["aria-invalid"] !== undefined
          ? element.props["aria-invalid"]
          : error
            ? true
            : undefined,
      "aria-errormessage":
        element.props["aria-errormessage"] || (error ? errorId : undefined),
      "aria-required":
        element.props["aria-required"] !== undefined
          ? element.props["aria-required"]
          : required || undefined,
    });
  });

  const wrapperClass = ["form-field", fullWidth ? "full-width" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div className={wrapperClass} style={style} {...props}>
        {label && (
          <label
            htmlFor={inputId}
            className={hideLabel ? "sr-only" : "field-label"}
            style={labelStyle}
          >
            {label}
            {required && (
              <span aria-hidden="true" className="required-indicator">
                {" "}
                *
              </span>
            )}
          </label>
        )}
        {renderedChildren}
        {helperText && (
          <div id={helperTextId} className="field-helper-text">
            {helperText}
          </div>
        )}
        {error && (
          <div id={errorId} role="alert" className="field-error">
            {error}
          </div>
        )}
      </div>
    </FormFieldContext.Provider>
  );
};

export default FormField;
