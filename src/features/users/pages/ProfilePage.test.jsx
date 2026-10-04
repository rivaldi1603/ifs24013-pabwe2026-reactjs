import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from './ProfilePage';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncPutProfile,
  asyncPostProfilePhoto,
  asyncPutProfilePassword,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
} from '../states/action';
import { showErrorDialog } from '../../../helpers/toolsHelper';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncPutProfile: vi.fn(),
  asyncPostProfilePhoto: vi.fn(),
  asyncPutProfilePassword: vi.fn(),
  setIsChangeProfileActionCreator: vi.fn(),
  setIsChangeProfilePhotoActionCreator: vi.fn(),
  setIsChangeProfilePasswordActionCreator: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
}));

describe('ProfilePage', () => {
  const mockDispatch = vi.fn();

  let mockState;

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    mockState = {
      profile: { name: 'Old Name', email: 'old@example.com', photo: '' },
      isChangeProfile: false,
      isChangeProfilePhoto: false,
      isChangeProfilePassword: false,
    };
    useSelector.mockImplementation((selector) => selector(mockState));
  });

  const renderComponent = () => render(<ProfilePage />);

  it('renders loading state if no profile', () => {
    useSelector.mockImplementation((selector) => {
      const state = { profile: null };
      return selector(state);
    });
    renderComponent();
    expect(screen.getByText('Memuat informasi profil...')).toBeInTheDocument();
  });

  it('renders profile correctly', () => {
    renderComponent();
    expect(screen.getByDisplayValue('Old Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('old@example.com')).toBeInTheDocument();
  });

  it('submits profile update', async () => {
    renderComponent();
    const nameInput = screen.getByLabelText('Nama Lengkap');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    
    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPutProfile).toHaveBeenCalledWith({ name: 'New Name', email: 'old@example.com' });
  });

  it('fails profile update if empty', async () => {
    renderComponent();
    const nameInput = screen.getByLabelText('Nama Lengkap');
    fireEvent.change(nameInput, { target: { value: '   ' } }); // Name is required but only spaces
    
    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    fireEvent.click(submitBtn);
    
    expect(showErrorDialog).toHaveBeenCalledWith('Validasi Gagal', expect.any(String));
    expect(asyncPutProfile).not.toHaveBeenCalled();
  });

  it('submits photo upload', async () => {
    renderComponent();
    const fileInput = screen.getByLabelText('Pilih Foto Profil');
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);
    
    const submitBtn = screen.getByRole('button', { name: /Unggah Foto/i });
    await userEvent.click(submitBtn);
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPostProfilePhoto).toHaveBeenCalledWith(file);
  });

  it('fails photo upload if no file', async () => {
    renderComponent();
    const submitBtn = screen.getByRole('button', { name: /Unggah Foto/i });
    await userEvent.click(submitBtn);
    
    expect(showErrorDialog).toHaveBeenCalledWith('Validasi Gagal', expect.any(String));
  });

  it('submits password change', async () => {
    renderComponent();
    const oldPass = screen.getByLabelText('Kata Sandi Saat Ini');
    const newPass = screen.getByLabelText('Kata Sandi Baru');
    
    await userEvent.type(oldPass, 'oldpass');
    await userEvent.type(newPass, 'newpass');
    
    const submitBtn = screen.getByRole('button', { name: /Perbarui Kata Sandi/i });
    await userEvent.click(submitBtn);
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPutProfilePassword).toHaveBeenCalledWith({ password: 'oldpass', new_password: 'newpass' });
  });

  it('fails password change if too short', async () => {
    renderComponent();
    const oldPass = screen.getByLabelText('Kata Sandi Saat Ini');
    const newPass = screen.getByLabelText('Kata Sandi Baru');
    
    await userEvent.type(oldPass, 'oldpass');
    await userEvent.type(newPass, 'short'); // less than 6 chars
    
    const submitBtn = screen.getByRole('button', { name: /Perbarui Kata Sandi/i });
    await userEvent.click(submitBtn);
    
    expect(showErrorDialog).toHaveBeenCalledWith('Validasi Gagal', expect.any(String));
    expect(asyncPutProfilePassword).not.toHaveBeenCalled();
  });

  it('clears state upon success', () => {
    useSelector.mockImplementation((selector) => {
      const state = {
        profile: { name: 'Old', email: 'old@a.com' },
        isChangeProfile: true,
        isChangeProfilePhoto: true,
        isChangeProfilePassword: true,
      };
      return selector(state);
    });
    
    renderComponent();
    expect(mockDispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(false));
    expect(mockDispatch).toHaveBeenCalledWith(setIsChangeProfilePhotoActionCreator(false));
    expect(mockDispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(false));
  });
});
