import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FormField, useFormFieldContext } from './FormField';

function CustomControl() {
  const ctx = useFormFieldContext();
  return (
    <input
      id={ctx?.id}
      aria-describedby={ctx?.ariaDescribedBy}
      aria-invalid={ctx?.ariaInvalid}
      placeholder="Custom Control Input"
    />
  );
}

describe('Shared FormField Wrapper Component', () => {
  it('automatically binds label htmlFor to child input id', () => {
    render(
      <FormField label="Theme Name">
        <input placeholder="Enter theme name" />
      </FormField>
    );

    const label = screen.getByText('Theme Name');
    const input = screen.getByPlaceholderText('Enter theme name');

    expect(label.tagName.toLowerCase()).toBe('label');
    expect(label.getAttribute('for')).toBeTruthy();
    expect(input.id).toBe(label.getAttribute('for'));
  });

  it('supports visually hidden labels via hideLabel prop', () => {
    render(
      <FormField label="Import theme JSON file" hideLabel>
        <input type="file" aria-label="Upload file" />
      </FormField>
    );

    const label = screen.getByText('Import theme JSON file');
    expect(label).toHaveClass('sr-only');
    expect(label.getAttribute('for')).toBeTruthy();
  });

  it('links helperText via aria-describedby', () => {
    render(
      <FormField label="Tags" helperText="Comma separated values">
        <input placeholder="Tags input" />
      </FormField>
    );

    const input = screen.getByPlaceholderText('Tags input');
    const helper = screen.getByText('Comma separated values');

    expect(helper.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('links error text via aria-describedby and sets aria-invalid', () => {
    render(
      <FormField label="Font Size" error="Font size must be a positive number">
        <input placeholder="Font size" />
      </FormField>
    );

    const input = screen.getByPlaceholderText('Font size');
    const errorMsg = screen.getByText('Font size must be a positive number');

    expect(errorMsg.id).toBeTruthy();
    expect(errorMsg.getAttribute('role')).toBe('alert');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe(errorMsg.id);
    expect(input.getAttribute('aria-describedby')).toBe(errorMsg.id);
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    const { container } = render(
      <FormField label="Description" fullWidth>
        <textarea placeholder="Description" />
      </FormField>
    );

    const fieldWrapper = container.firstChild as HTMLElement;
    expect(fieldWrapper).toHaveClass('form-field');
    expect(fieldWrapper).toHaveClass('full-width');
  });

  it('respects explicit id prop when provided', () => {
    render(
      <FormField id="custom-field-id" label="Custom ID Field">
        <input placeholder="Explicit ID input" />
      </FormField>
    );

    const label = screen.getByText('Custom ID Field');
    const input = screen.getByPlaceholderText('Explicit ID input');

    expect(label.getAttribute('for')).toBe('custom-field-id');
    expect(input.id).toBe('custom-field-id');
  });

  it('provides context for custom child components', () => {
    render(
      <FormField label="Context Field" helperText="Context helper">
        <CustomControl />
      </FormField>
    );

    const label = screen.getByText('Context Field');
    const input = screen.getByPlaceholderText('Custom Control Input');
    const helper = screen.getByText('Context helper');

    expect(input.id).toBe(label.getAttribute('for'));
    expect(input.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('works with select and textarea elements', () => {
    render(
      <>
        <FormField label="Font Family">
          <select data-testid="select-input">
            <option value="Inter">Inter</option>
          </select>
        </FormField>
        <FormField label="Bio">
          <textarea data-testid="textarea-input" />
        </FormField>
      </>
    );

    const selectLabel = screen.getByText('Font Family');
    const select = screen.getByTestId('select-input');
    expect(select.id).toBe(selectLabel.getAttribute('for'));

    const textareaLabel = screen.getByText('Bio');
    const textarea = screen.getByTestId('textarea-input');
    expect(textarea.id).toBe(textareaLabel.getAttribute('for'));
  });
});
