import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from './RegisterPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthRegister } from '../states/action';

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

describe('RegisterPage', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockReturnValue(false); // isAuthRegister false
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

  it('should render the form', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Nama lengkap Anda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Minimal 6 karakter')).toBeInTheDocument();
  });

  it('should allow typing in inputs', async () => {
    renderComponent();
    const nameInput = screen.getByPlaceholderText('Nama lengkap Anda');
    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password');

    expect(nameInput).toHaveValue('Test Name');
    expect(emailInput).toHaveValue('test@test.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('should call dispatch and navigate on success', async () => {
    asyncSetAuthRegister.mockReturnValue(() => Promise.resolve(true));
    mockDispatch.mockResolvedValue(true);
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Nama lengkap Anda');
    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');
    const submitButton = screen.getByRole('button', { name: /Daftar/i });

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password');
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncSetAuthRegister).toHaveBeenCalledWith({
      name: 'Test Name',
      email: 'test@test.com',
      password: 'password',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('should not navigate on fail', async () => {
    asyncSetAuthRegister.mockReturnValue(() => Promise.resolve(false));
    mockDispatch.mockResolvedValue(false);
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Nama lengkap Anda');
    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');
    const submitButton = screen.getByRole('button', { name: /Daftar/i });

    await userEvent.type(nameInput, 'Test Name');
    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password');
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not dispatch if fields are empty', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: /Daftar/i });
    await userEvent.click(submitButton);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', async () => {
    renderComponent();
    // Use type="button" to avoid picking the submit button
    const toggleBtn = screen.getByRole('button', { name: '' });
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should show loading state', () => {
    useSelector.mockReturnValue(true); // isAuthRegister true
    renderComponent();
    const submitBtn = screen.getAllByRole('button')[1];
    expect(submitBtn).toBeDisabled();
  });
});
