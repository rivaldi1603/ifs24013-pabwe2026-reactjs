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
    useSelector.mockImplementation((selector) =>
      selector({
        users: [
          { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '2023-01-01' },
          { id: 2, name: 'Bob', email: 'bob@example.com', created_at: null },
        ],
      })
    );
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

  it('handles photo, missing name and email-based search', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        users: [
          { id: 3, name: 'Carol', email: 'carol@example.com', photo: 'http://img/c.png' },
          { id: 4, email: 'noname@example.com' },
          { id: 5, name: 'Dave' },
        ],
      })
    );
    const { container } = renderComponent();
    await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument());
    expect(screen.getByAltText('Carol')).toHaveAttribute('src', 'http://img/c.png');
    const imgs = container.querySelectorAll('img');
    expect(imgs[1].getAttribute('src')).toContain('name=User');

    await userEvent.type(screen.getByPlaceholderText(/Cari nama atau email/i), 'noname');
    expect(screen.getByText('noname@example.com')).toBeInTheDocument();
    expect(screen.queryByText('Carol')).not.toBeInTheDocument();
    expect(screen.queryByText('Dave')).not.toBeInTheDocument();
  });
});
