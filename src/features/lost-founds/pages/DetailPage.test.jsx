import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DetailPage from './DetailPage';
import { MemoryRouter, useNavigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetLostFoundById, asyncDeleteLostFound } from '../states/action';
import { showConfirmDialog } from '../../../helpers/toolsHelper';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncSetLostFoundById: vi.fn(),
  asyncDeleteLostFound: vi.fn(),
  asyncPutLostFound: vi.fn(),
  asyncPostLostFoundCover: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  formatDate: vi.fn(() => '01 Jan 2023'),
  showConfirmDialog: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('DetailPage', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={['/lost-founds/1']}>
        <Routes>
          <Route path="/lost-founds/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

  it('renders loading state', () => {
    useSelector.mockReturnValue(false); // isLostFound false
    const { container } = renderComponent();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders not found state', () => {
    useSelector.mockImplementation((selector) => {
      const state = { isLostFound: true, lostFound: null, profile: null };
      return selector(state);
    });
    renderComponent();
    expect(screen.getByText('Laporan Tidak Ditemukan')).toBeInTheDocument();
  });

  it('renders detail page and allows delete', async () => {
    useSelector.mockImplementation((selector) => {
      const state = {
        isLostFound: true,
        lostFound: {
          id: 1,
          title: 'Lost Item',
          description: 'Desc',
          status: 'lost',
          is_completed: 1,
          cover: 'cover.jpg',
          created_at: '2023-01-01',
          author: { id: 1, name: 'User' },
        },
        profile: { id: 1 }, // Same user
      };
      return selector(state);
    });

    renderComponent();
    expect(screen.getByText('Lost Item')).toBeInTheDocument();
    
    // Test delete
    showConfirmDialog.mockResolvedValue(true);
    const deleteBtn = screen.getByRole('button', { name: /Hapus/i });
    await userEvent.click(deleteBtn);
    
    expect(showConfirmDialog).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncDeleteLostFound).toHaveBeenCalledWith('1');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when back button clicked', async () => {
    useSelector.mockImplementation((selector) => selector({ isLostFound: true, lostFound: { id: 1, title: 'Item', author: {} }, profile: {} }));
    renderComponent();
    const backBtn = screen.getByRole('link', { name: /Kembali/i });
    expect(backBtn).toHaveAttribute('href', '/');
  });

  it('opens change modal and changes cover', async () => {
    useSelector.mockImplementation((selector) => {
      const state = {
        isLostFound: true,
        lostFound: {
          id: 1,
          title: 'Lost Item',
          description: 'Desc',
          status: 'lost',
          is_completed: 0,
          cover: null,
          created_at: '2023-01-01',
          author: { id: 1, name: 'User' },
        },
        profile: { id: 1 },
      };
      return selector(state);
    });

    renderComponent();
    
    // Open ChangeModal
    const editBtn = screen.getByRole('button', { name: /Edit Data/i });
    await userEvent.click(editBtn);
    expect(screen.getByText('Ubah Laporan')).toBeInTheDocument();
    
    // Open ChangeCoverModal
    const changeCoverBtn = screen.getByRole('button', { name: /Ganti Foto/i });
    await userEvent.click(changeCoverBtn);
    expect(screen.getByText('Unggah Foto / Cover')).toBeInTheDocument();
  });

  const myPostState = {
    isLostFound: true,
    lostFound: {
      id: 1,
      title: 'Lost Item',
      description: 'Desc',
      status: 'lost',
      is_completed: 0,
      cover: null,
      created_at: '2023-01-01',
      author: { id: 1, name: 'User' },
    },
    profile: { id: 1 },
  };

  it('closes change modal and refreshes after saving', async () => {
    mockDispatch.mockResolvedValue(undefined);
    useSelector.mockImplementation((selector) => selector(myPostState));
    renderComponent();
    expect(asyncSetLostFoundById).toHaveBeenCalledTimes(1);

    // open & cancel -> onClose
    await userEvent.click(screen.getByRole('button', { name: /Edit Data/i }));
    await userEvent.click(screen.getByRole('button', { name: /Batal/i }));
    expect(screen.queryByText('Ubah Laporan')).not.toBeInTheDocument();

    // open & save -> onSuccess (handleRefresh) + onClose
    await userEvent.click(screen.getByRole('button', { name: /Edit Data/i }));
    await userEvent.click(screen.getByRole('button', { name: /Simpan Perubahan/i }));
    expect(asyncSetLostFoundById).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Ubah Laporan')).not.toBeInTheDocument();
  });

  it('closes change cover modal', async () => {
    useSelector.mockImplementation((selector) => selector(myPostState));
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /Ganti Foto/i }));
    expect(screen.getByText('Unggah Foto / Cover')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Batal/i }));
    expect(screen.queryByText('Unggah Foto / Cover')).not.toBeInTheDocument();
  });

  it('does not delete when confirmation is cancelled', async () => {
    showConfirmDialog.mockResolvedValue(false);
    useSelector.mockImplementation((selector) => selector(myPostState));
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: /Hapus/i }));
    expect(asyncDeleteLostFound).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders found status with author photo for other users', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        isLostFound: true,
        lostFound: {
          id: 2,
          title: 'Found Item',
          description: 'D',
          status: 'found',
          is_completed: 0,
          cover: null,
          author: { id: 9, name: 'Other', photo: 'http://img/a.png' },
        },
        profile: { id: 1 },
      })
    );
    renderComponent();
    expect(screen.getByText('DITEMUKAN')).toBeInTheDocument();
    expect(screen.getByAltText('Other')).toHaveAttribute('src', 'http://img/a.png');
    expect(screen.queryByText('Laporan Anda')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Edit Data/i })).not.toBeInTheDocument();
  });

  it('renders without author and profile', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        isLostFound: true,
        lostFound: { id: 3, title: 'No Author', status: 'lost', is_completed: 0 },
        profile: null,
      })
    );
    renderComponent();
    expect(screen.getByText('No Author')).toBeInTheDocument();
    expect(screen.getByText('HILANG')).toBeInTheDocument();
  });
});
