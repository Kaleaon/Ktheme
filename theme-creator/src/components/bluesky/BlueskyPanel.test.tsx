import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BlueskyPanel } from './BlueskyPanel';
import { useBluesky } from '../../state/BlueskyContext';
import { useTheme } from '../../state/ThemeContext';

jest.mock('../../state/BlueskyContext', () => ({
  useBluesky: jest.fn(),
}));

jest.mock('../../state/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

describe('BlueskyPanel Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({
      state: {
        currentTheme: { metadata: { name: 'Test Theme' }, colorScheme: {} },
        savedThemes: [],
      },
      dispatch: jest.fn(),
    });
  });

  it('renders login error with role="alert" and aria-live="assertive" when authentication fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    (useBluesky as jest.Mock).mockReturnValue({
      agent: null,
      profile: null,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      resumeSession: jest.fn(),
    });

    render(<BlueskyPanel />);

    const handleInput = screen.getByPlaceholderText('user.bsky.social');
    const passwordInput = screen.getByPlaceholderText('xxxx-xxxx-xxxx-xxxx');
    const loginBtn = screen.getByRole('button', { name: /Log In/i });

    fireEvent.change(handleInput, { target: { value: 'user.bsky.social' } });
    fireEvent.change(passwordInput, { target: { value: 'invalid-pass' } });
    fireEvent.click(loginBtn);

    await waitFor(() => {
      const alertEl = screen.getByRole('alert');
      expect(alertEl).toBeInTheDocument();
      expect(alertEl.getAttribute('aria-live')).toBe('assertive');
      expect(alertEl).toHaveTextContent('Invalid credentials');
    });
  });
});
