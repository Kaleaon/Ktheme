import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { KthemeProvider, useKtheme, useKthemeToken, batchSetCssVariables, flushCssVariables, ThemeStudio } from '../src';

function TestConsumer() {
  const { themeId, setToken } = useKtheme();
  const primary = useKthemeToken('primary');
  const onPrimary = useKthemeToken('onPrimary');

  return (
    <div>
      <span data-testid="theme-id">{themeId}</span>
      <span data-testid="token-primary">{primary}</span>
      <span data-testid="token-onprimary">{onPrimary}</span>
      <button
        data-testid="update-btn"
        onClick={() => setToken('primary', '#123456')}
      >
        Update Primary
      </button>
    </div>
  );
}

describe('@ktheme/react library', () => {
  it('KthemeProvider provides default theme tokens to children', () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <TestConsumer />
      </KthemeProvider>
    );

    expect(screen.getByTestId('theme-id').textContent).toBe('navy-gold');
    expect(screen.getByTestId('token-primary').textContent).toBe('#D4AF37');
    expect(screen.getByTestId('token-onprimary').textContent).toBe('#0A1630');
  });

  it('useKthemeToken updates reactively when setToken is called', () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <TestConsumer />
      </KthemeProvider>
    );

    expect(screen.getByTestId('token-primary').textContent).toBe('#D4AF37');

    act(() => {
      fireEvent.click(screen.getByTestId('update-btn'));
    });

    expect(screen.getByTestId('token-primary').textContent).toBe('#123456');
  });

  it('batchSetCssVariables updates DOM style properties', () => {
    const el = document.createElement('div');
    batchSetCssVariables(el, {
      '--md-sys-color-primary': '#FF0000',
      '--md-sys-color-surface': '#00FF00',
    });
    flushCssVariables();

    // Verify property values were applied
    expect(el.style.getPropertyValue('--md-sys-color-primary')).toBe('#FF0000');
    expect(el.style.getPropertyValue('--md-sys-color-surface')).toBe('#00FF00');
  });

  it('ThemeStudio component renders and allows tab switching', () => {
    render(
      <KthemeProvider themeId="navy-gold">
        <ThemeStudio embedded />
      </KthemeProvider>
    );

    expect(screen.getByText('THEME STUDIO')).toBeInTheDocument();
    expect(screen.getByText('🎨 Customizer')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText('📱 Presets'));
    });

    expect(screen.getByText('NAVY GOLD')).toBeInTheDocument();
  });
});
