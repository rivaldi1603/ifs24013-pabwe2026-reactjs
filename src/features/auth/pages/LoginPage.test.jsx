import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncSetAuthLogin } from '../states/action';

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
  asyncSetAuthLogin: vi.fn(),
}));

describe('LoginPage Component', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockReturnValue(false);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

  it('should allow user to type in inputs', async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password');

    expect(emailInput).toHaveValue('test@test.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('should toggle password visibility', async () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleBtn = screen.getByRole('button', { name: '' }); // the eye icon

    expect(passwordInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    await userEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call dispatch on submit', async () => {
    asyncSetAuthLogin.mockReturnValue(() => Promise.resolve());
    renderComponent();
    const emailInput = screen.getByPlaceholderText('nama@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /Masuk/i });

    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password');
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncSetAuthLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
  });

  it('does not dispatch if fields are empty', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: /Masuk/i });
    await userEvent.click(submitButton);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    useSelector.mockReturnValue(true);
    renderComponent();
    expect(screen.getAllByRole('button')[1]).toBeDisabled();
  });
});
