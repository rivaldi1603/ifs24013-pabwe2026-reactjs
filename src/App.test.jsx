import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import App from './App';
import apiHelper from './helpers/apiHelper';

// Mock API calls so we don't hit the real network during tests
vi.mock('./features/users/api/userApi', () => ({
  default: {
    getProfile: vi.fn().mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    }),
  },
}));

vi.mock('./features/lost-founds/api/lostFoundApi', () => ({
  default: {
    getLostFounds: vi.fn().mockResolvedValue([]),
    getStatsDaily: vi.fn().mockResolvedValue([]),
    getStatsMonthly: vi.fn().mockResolvedValue([]),
  },
}));

describe('App Integration Test', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render LoginPage by default if not authenticated', async () => {
    // Render the App with initial route as '/'
    renderWithProviders(<App />, { route: '/' });

    // Since there is no token, LostFoundLayout should redirect to /auth/login
    // We expect to see login page content
    await waitFor(() => {
      expect(screen.getByText('Selamat Datang Kembali')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
    });
  });

  it('should render HomePage if authenticated', async () => {
    // Set token to simulate logged in state
    apiHelper.putAccessToken('dummy-token');

    // Preload state so LostFoundLayout doesn't wait for profile fetch
    const preloadedState = {
      isProfile: true,
      profile: { id: 1, name: 'Test User', email: 'test@example.com' },
      lostFounds: []
    };

    // Render the App with initial route as '/'
    renderWithProviders(<App />, { route: '/', preloadedState });

    // Should not redirect, should render HomePage because we have a token
    await waitFor(() => {
      expect(screen.getByText(/Kelola dan pantau semua laporan/i)).toBeInTheDocument();
      expect(screen.getByText('Total Laporan')).toBeInTheDocument();
    });
  });
});
