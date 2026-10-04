import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';
import LoginPage from './LoginPage';

// Mock the action so we can track if it was dispatched
vi.mock('../states/action', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetAuthLogin: vi.fn().mockImplementation(() => {
      return (dispatch) => {
        // simulate dispatch behavior without network
      };
    }),
  };
});

describe('LoginPage Component', () => {
  it('should render email and password inputs', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/Alamat Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kata Sandi/i)).toBeInTheDocument();
  });

  it('should allow user to type in inputs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Alamat Email/i);
    const passwordInput = screen.getByLabelText(/Kata Sandi/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
