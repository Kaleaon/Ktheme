import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { KChip, KNavRail, KToggle } from './DCs';
import { LinkpointUIKit } from '../linkpoint/LinkpointUIKit';
import { IconicShowcaseGallery } from './IconicShowcaseGallery';

describe('Accessibility ARIA State Binding Tests', () => {
  describe('KChip Component', () => {
    it('renders as button element with aria-pressed attribute based on active prop', () => {
      const { rerender } = render(<KChip label="Active Chip" active={true} />);
      const chipBtn = screen.getByRole('button', { name: 'Active Chip' });

      expect(chipBtn.tagName).toBe('BUTTON');
      expect(chipBtn.getAttribute('type')).toBe('button');
      expect(chipBtn.getAttribute('aria-pressed')).toBe('true');

      rerender(<KChip label="Active Chip" active={false} />);
      expect(chipBtn.getAttribute('aria-pressed')).toBe('false');
    });

    it('renders delete icon with role="button", tabIndex=0, aria-label, and handles keyboard Enter/Space', () => {
      const handleDelete = jest.fn();
      render(<KChip label="Deletable Chip" onDelete={handleDelete} />);

      const deleteIcon = screen.getByRole('button', { name: 'Remove Deletable Chip' });
      expect(deleteIcon.getAttribute('tabIndex')).toBe('0');

      fireEvent.keyDown(deleteIcon, { key: 'Enter' });
      expect(handleDelete).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(deleteIcon, { key: ' ' });
      expect(handleDelete).toHaveBeenCalledTimes(2);
    });
  });

  describe('KNavRail Component', () => {
    it('renders navigation buttons with aria-selected attribute', () => {
      const items = [
        { id: 'home', label: 'Home' },
        { id: 'settings', label: 'Settings' },
      ];
      render(<KNavRail items={items} activeId="home" onSelect={() => {}} />);

      const homeBtn = screen.getByRole('button', { name: /Home/i });
      const settingsBtn = screen.getByRole('button', { name: /Settings/i });

      expect(homeBtn.getAttribute('type')).toBe('button');
      expect(homeBtn.getAttribute('aria-selected')).toBe('true');
      expect(settingsBtn.getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('KToggle Component', () => {
    it('renders a button element with role="switch" and aria-checked attribute', () => {
      const handleChange = jest.fn();
      const { rerender } = render(<KToggle checked={true} onChange={handleChange} label="Dark Mode" />);

      const switchBtn = screen.getByRole('switch');
      expect(switchBtn.tagName).toBe('BUTTON');
      expect(switchBtn.getAttribute('type')).toBe('button');
      expect(switchBtn.getAttribute('aria-checked')).toBe('true');

      fireEvent.click(switchBtn);
      expect(handleChange).toHaveBeenCalledWith(false);

      rerender(<KToggle checked={false} onChange={handleChange} label="Dark Mode" />);
      expect(switchBtn.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('LinkpointUIKit Component', () => {
    it('binds aria-pressed to device size and layout pack switcher buttons', () => {
      render(<LinkpointUIKit />);

      const desktopBtn = screen.getByRole('button', { name: 'DESKTOP' });
      const tabletBtn = screen.getByRole('button', { name: 'TABLET' });
      const mobileBtn = screen.getByRole('button', { name: 'MOBILE' });

      expect(desktopBtn.getAttribute('aria-pressed')).toBe('true');
      expect(tabletBtn.getAttribute('aria-pressed')).toBe('false');
      expect(mobileBtn.getAttribute('aria-pressed')).toBe('false');

      fireEvent.click(mobileBtn);

      expect(desktopBtn.getAttribute('aria-pressed')).toBe('false');
      expect(mobileBtn.getAttribute('aria-pressed')).toBe('true');

      const standardPackBtn = screen.getByRole('button', { name: 'standard' });
      const compactPackBtn = screen.getByRole('button', { name: 'compact' });

      expect(standardPackBtn.getAttribute('aria-pressed')).toBe('true');
      expect(compactPackBtn.getAttribute('aria-pressed')).toBe('false');

      fireEvent.click(compactPackBtn);
      expect(standardPackBtn.getAttribute('aria-pressed')).toBe('false');
      expect(compactPackBtn.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('IconicShowcaseGallery Component', () => {
    it('binds aria-pressed to pack selector and variant switcher buttons', () => {
      render(<IconicShowcaseGallery />);

      const lcarsBtn = screen.getByRole('button', { name: 'LCARS Activation Pack' });
      const metroBtn = screen.getByRole('button', { name: 'Windows Activation Pack' });

      expect(lcarsBtn.getAttribute('aria-pressed')).toBe('true');
      expect(metroBtn.getAttribute('aria-pressed')).toBe('false');

      fireEvent.click(metroBtn);
      expect(lcarsBtn.getAttribute('aria-pressed')).toBe('false');
      expect(metroBtn.getAttribute('aria-pressed')).toBe('true');

      const darkVariantBtn = screen.getByRole('button', { name: 'dark' });
      const lightVariantBtn = screen.getByRole('button', { name: 'light' });

      expect(darkVariantBtn.getAttribute('aria-pressed')).toBe('true');
      expect(lightVariantBtn.getAttribute('aria-pressed')).toBe('false');

      fireEvent.click(lightVariantBtn);
      expect(darkVariantBtn.getAttribute('aria-pressed')).toBe('false');
      expect(lightVariantBtn.getAttribute('aria-pressed')).toBe('true');
    });
  });
});
