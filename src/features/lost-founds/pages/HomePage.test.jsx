import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetLostFounds, asyncSetLostFoundStats } from '../states/action';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncSetLostFounds: vi.fn(),
  asyncSetLostFoundStats: vi.fn(),
}));

describe('HomePage', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => {
      const state = {
        lostFounds: [
          {
            id: 1,
            title: 'Lost Item',
            description: 'Lost somewhere',
            status: 'lost',
            is_completed: 0,
            cover: 'http://cover.com/1.jpg',
            created_at: '2023-01-01',
            author: { name: 'User A', photo: null },
          },
          {
            id: 2,
            title: 'Found Item',
            description: 'Found here',
            status: 'found',
            is_completed: 1,
            cover: null,
            created_at: '2023-01-02',
            author: { name: 'User B', photo: null },
          }
        ],
        lostFoundStats: { daily: [], monthly: [] }
      };
      return selector(state);
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

  it('renders dashboard with stats and items', () => {
    renderComponent();
    expect(screen.getByText('Dashboard Laporan')).toBeInTheDocument();
    expect(screen.getByText('Lost Item')).toBeInTheDocument();
    expect(screen.getByText('Found Item')).toBeInTheDocument();
  });

  it('handles search query', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Cari berdasarkan judul atau deskripsi/i);
    await userEvent.type(searchInput, 'Lost');
    
    expect(screen.getByText('Lost Item')).toBeInTheDocument();
    expect(screen.queryByText('Found Item')).not.toBeInTheDocument();
  });

  it('handles search query submission via enter', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Cari berdasarkan judul atau deskripsi/i);
    await userEvent.type(searchInput, 'Lost{enter}');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles filter status and completed', async () => {
    renderComponent();
    const statusSelect = screen.getAllByRole('combobox')[0]; // Status
    const completedSelect = screen.getAllByRole('combobox')[1]; // Completed
    
    await userEvent.selectOptions(statusSelect, 'lost');
    await userEvent.selectOptions(completedSelect, '1');
    
    // dispatch should be called when filters change
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(asyncSetLostFounds).toHaveBeenCalled();
    });
  });

  it('opens AddModal when Laporan Baru is clicked', async () => {
    renderComponent();
    const btn = screen.getByRole('button', { name: /Laporan Baru/i });
    await userEvent.click(btn);
    // AddModal will show 'Tambah Laporan Baru'
    expect(screen.getByText('Tambah Laporan Baru')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    useSelector.mockImplementation((selector) => {
      const state = { lostFounds: [], lostFoundStats: { daily: [], monthly: [] } };
      return selector(state);
    });
    renderComponent();
    expect(screen.getByText('Tidak ada data ditemukan')).toBeInTheDocument();
  });
});
