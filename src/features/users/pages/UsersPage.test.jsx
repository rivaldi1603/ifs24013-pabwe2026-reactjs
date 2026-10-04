import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from './UsersPage';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetUsers } from '../states/action';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncSetUsers: vi.fn(),
}));

describe('UsersPage', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue([
      { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '2023-01-01' },
      { id: 2, name: 'Bob', email: 'bob@example.com', created_at: null },
    ]);
  });

  const renderComponent = () => render(<UsersPage />);

  it('renders loading initially then users', async () => {
    renderComponent();
    // Since asyncSetUsers is mocked, the effect will run and setIsLoading(false) happens synchronously after await.
    // So the loading state might be brief or not visible, but we can verify if the users are rendered.
    expect(screen.getByText('Daftar Pengguna')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncSetUsers).toHaveBeenCalled();
  });

  it('filters users by search query', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Cari nama atau email/i);
    await userEvent.type(searchInput, 'Alice');
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('shows empty state when no users match', async () => {
    renderComponent();
    const searchInput = screen.getByPlaceholderText(/Cari nama atau email/i);
    await userEvent.type(searchInput, 'Zzz');
    
    expect(screen.getByText('Tidak ada pengguna yang ditemukan.')).toBeInTheDocument();
  });
});
