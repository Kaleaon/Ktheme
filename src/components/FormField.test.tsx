import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormField, FormInput, FormSwitch } from './FormField';

describe('FormField & Controls Accessibility', () => {
  it('connects label to input via htmlFor and generated ID', () => {
    render(
      <FormField label="Username">
        <FormInput placeholder="Enter username" />
      </FormField>
    );

    const label = screen.getByText('Username');
    const input = screen.getByPlaceholderText('Enter username');

    expect(label.getAttribute('for')).toBeTruthy();
    expect(input.id).toBe(label.getAttribute('for'));
  });

  it('links description/helper text via aria-describedby', () => {
    render(
      <FormField label="Password" description="Must be at least 8 characters">
        <FormInput type="password" />
      </FormField>
    );

    const input = screen.getByLabelText('Password');
    const desc = screen.getByText('Must be at least 8 characters');

    expect(desc.id).toBeTruthy();
    expect(input.getAttribute('aria-describedby')).toBe(desc.id);
  });

  it('handles error states with aria-invalid and aria-errormessage', () => {
    render(
      <FormField label="Email" error="Invalid email address">
        <FormInput type="email" />
      </FormField>
    );

    const input = screen.getByLabelText('Email');
    const errorMsg = screen.getByText('Invalid email address');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(errorMsg.id).toBeTruthy();
    expect(input.getAttribute('aria-errormessage')).toBe(errorMsg.id);
    expect(input.getAttribute('aria-describedby')).toContain(errorMsg.id);
  });

  it('renders FormSwitch with role="switch" and aria-checked', () => {
    render(
      <FormField label="Enable Dark Mode">
        <FormSwitch checked={true} />
      </FormField>
    );

    const switchEl = screen.getByRole('switch');
    expect(switchEl.getAttribute('aria-checked')).toBe('true');
  });
});
