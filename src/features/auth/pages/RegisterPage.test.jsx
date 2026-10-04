import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthRegister } from '../states/action';
import { showErrorDialog } from '../../../helpers/toolsHelper';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../states/action', () => ({
  asyncSetAuthRegister: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
}));

describe('RegisterPage', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  let isAuthRegister = false;

  beforeEach(() => {
    vi.clearAllMocks();
    isAuthRegister = false;
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    // Execute the real selector so it is covered
    useSelector.mockImplementation((selector) => selector({ isAuthRegister }));
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

  const getInputs = () => ({
    nameInput: screen.getByPlaceholderText('Nama lengkap Anda'),
    emailInput: screen.getByPlaceholderText('nama@email.com'),
    passwordInput: screen.getByPlaceholderText('Minimal 6 karakter'),
    confirmInput: screen.getByPlaceholderText('Ulangi kata sandi'),
    submitButton: screen.getByRole('button', { name: /Daftar/i }),
  });

  const fillForm = async (password = 'password', confirmation = 'password') => {
    const inputs = getInputs();
    await userEvent.type(inputs.nameInput, 'Test Name');
    await userEvent.type(inputs.emailInput, 'test@test.com');
    await userEvent.type(inputs.passwordInput, password);
    await userEvent.type(inputs.confirmInput, confirmation);
    return inputs;
  };

  it('should render the form including password confirmation', () => {
    renderComponent();
    const { nameInput, emailInput, passwordInput, confirmInput } = getInputs();
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmInput).toBeInTheDocument();
  });

  it('should allow typing in inputs', async () => {
    renderComponent();
    const { nameInput, emailInput, passwordInput, confirmInput } = await fillForm();
    expect(nameInput).toHaveValue('Test Name');
    expect(emailInput).toHaveValue('test@test.com');
    expect(passwordInput).toHaveValue('password');
    expect(confirmInput).toHaveValue('password');
    expect(screen.queryByText('Kata sandi tidak cocok.')).not.toBeInTheDocument();
  });

  it('should call dispatch and navigate on success', async () => {
    asyncSetAuthRegister.mockReturnValue({ type: 'REGISTER' });
    mockDispatch.mockResolvedValue(true);
    renderComponent();

    const { submitButton } = await fillForm();
    await userEvent.click(submitButton);

    expect(asyncSetAuthRegister).toHaveBeenCalledWith({
      name: 'Test Name',
      email: 'test@test.com',
      password: 'password',
      passwordConfirmation: 'password',
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('should not navigate on fail', async () => {
    asyncSetAuthRegister.mockReturnValue({ type: 'REGISTER' });
    mockDispatch.mockResolvedValue(false);
    renderComponent();

    const { submitButton } = await fillForm();
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows mismatch hint and blocks submit when passwords differ', async () => {
    renderComponent();
    const { submitButton, confirmInput } = await fillForm('password', 'different');

    expect(screen.getByText('Kata sandi tidak cocok.')).toBeInTheDocument();
    expect(confirmInput).toHaveAttribute('aria-invalid', 'true');

    await userEvent.click(submitButton);
    expect(showErrorDialog).toHaveBeenCalledWith(
      'Registrasi Gagal',
      'Konfirmasi kata sandi tidak cocok.'
    );
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('keeps submit disabled when fields are empty', async () => {
    renderComponent();
    const { submitButton } = getInputs();
    expect(submitButton).toBeDisabled();
    await userEvent.click(submitButton);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should toggle password visibility for both fields', async () => {
    renderComponent();
    const toggleBtn = screen.getByRole('button', { name: 'Tampilkan kata sandi' });
    const { passwordInput, confirmInput } = getInputs();

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should show loading state', () => {
    isAuthRegister = true;
    renderComponent();
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons[buttons.length - 1];
    expect(submitBtn).toBeDisabled();
    expect(submitBtn.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
