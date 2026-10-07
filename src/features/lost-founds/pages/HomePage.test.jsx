import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';
import { MemoryRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetLostFounds } from '../states/action';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncSetLostFounds: vi.fn(),
  asyncPostLostFound: vi.fn(),
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
            description: 'Lost in park',
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

  it('closes AddModal via Batal', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /Laporan Baru/i }));
    await userEvent.click(screen.getByRole('button', { name: /Batal/i }));
    expect(screen.queryByText('Tambah Laporan Baru')).not.toBeInTheDocument();
  });

  it('refetches data after AddModal success', async () => {
    mockDispatch.mockResolvedValue(undefined);
    renderComponent();
    const callsBefore = asyncSetLostFounds.mock.calls.length;
    await userEvent.click(screen.getByRole('button', { name: /Laporan Baru/i }));
    await userEvent.type(screen.getByLabelText('Judul Laporan'), 'Kunci');
    await userEvent.type(screen.getByLabelText('Deskripsi Detail'), 'Hilang');
    await userEvent.click(screen.getByRole('button', { name: /Simpan Laporan/i }));
    expect(asyncSetLostFounds.mock.calls.length).toBe(callsBefore + 1);
    expect(screen.queryByText('Tambah Laporan Baru')).not.toBeInTheDocument();
  });

  it('matches search against description', async () => {
    renderComponent();
    await userEvent.type(
      screen.getByPlaceholderText(/Cari berdasarkan judul atau deskripsi/i),
      'here'
    );
    expect(screen.getByText('Found Item')).toBeInTheDocument();
    expect(screen.queryByText('Lost Item')).not.toBeInTheDocument();
  });

  it('handles null list and author fallbacks', () => {
    useSelector.mockImplementation((selector) =>
      selector({ lostFounds: null, lostFoundStats: null })
    );
    const { unmount } = renderComponent();
    expect(screen.getByText('Tidak ada data ditemukan')).toBeInTheDocument();
    unmount();

    useSelector.mockImplementation((selector) =>
      selector({
        lostFounds: [
          { id: 5, title: 'With Photo', description: 'x', status: 'lost', is_completed: 0, author: { name: 'P', photo: 'http://img/p.png' } },
          { id: 6, title: 'No Author', description: 'y', status: 'found', is_completed: 0 },
        ],
      })
    );
    renderComponent();
    expect(screen.getByAltText('P')).toHaveAttribute('src', 'http://img/p.png');
    expect(screen.getByText('No Author')).toBeInTheDocument();
  });
});
