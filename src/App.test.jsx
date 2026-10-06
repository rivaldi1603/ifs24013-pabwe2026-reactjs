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
    getUsers: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('./features/lost-founds/api/lostFoundApi', () => ({
  default: {
    getLostFounds: vi.fn().mockResolvedValue([]),
    getLostFoundById: vi.fn().mockResolvedValue(null),
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

  it('should lazily render the register page', async () => {
    renderWithProviders(<App />, { route: '/auth/register' });
    expect(await screen.findByText('Buat Akun Baru', {}, { timeout: 5000 })).toBeInTheDocument();
  });

  describe('authenticated lazy routes', () => {
    const preloadedState = {
      isProfile: true,
      profile: { id: 1, name: 'Test User', email: 'test@example.com' },
      users: [],
      lostFounds: [],
    };

    beforeEach(() => {
      apiHelper.putAccessToken('dummy-token');
    });

    it('renders the users page', async () => {
      renderWithProviders(<App />, { route: '/users', preloadedState });
      expect(
        await screen.findByRole('heading', { name: 'Daftar Pengguna' }, { timeout: 5000 })
      ).toBeInTheDocument();
    });

    it('renders the profile page', async () => {
      renderWithProviders(<App />, { route: '/profile', preloadedState });
      expect(
        await screen.findByRole('heading', { name: /Profil & Pengaturan Akun/i }, { timeout: 5000 })
      ).toBeInTheDocument();
    });

    it('renders the detail page', async () => {
      renderWithProviders(<App />, {
        route: '/lost-founds/1',
        preloadedState: { ...preloadedState, isLostFound: true, lostFound: null },
      });
      await waitFor(
        () => expect(screen.getByText('Laporan Tidak Ditemukan')).toBeInTheDocument(),
        { timeout: 5000 }
      );
    });

    it('renders the stats page', async () => {
      renderWithProviders(<App />, { route: '/stats', preloadedState });
      expect(
        await screen.findByRole('heading', { name: 'Statistik Laporan' }, { timeout: 5000 })
      ).toBeInTheDocument();
    });
  });
});
