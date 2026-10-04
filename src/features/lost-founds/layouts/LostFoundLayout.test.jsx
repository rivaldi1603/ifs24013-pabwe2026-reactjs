import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LostFoundLayout from './LostFoundLayout';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import apiHelper from '../../../helpers/apiHelper';
import { asyncSetProfile } from '../../users/states/action';

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

vi.mock('../../../helpers/apiHelper', () => ({
  default: {
    getAccessToken: vi.fn(),
    removeAccessToken: vi.fn(),
  },
}));

vi.mock('../../users/states/action', () => ({
  asyncSetProfile: vi.fn(),
}));

describe('LostFoundLayout', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <LostFoundLayout />
      </MemoryRouter>
    );

  it('redirects to login if no token', () => {
    apiHelper.getAccessToken.mockReturnValue(null);
    renderComponent();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('dispatches asyncSetProfile if token exists but isProfile is false', () => {
    apiHelper.getAccessToken.mockReturnValue('token');
    useSelector.mockImplementation((selector) => {
      const state = { isProfile: false, profile: null };
      return selector(state);
    });
    renderComponent();
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncSetProfile).toHaveBeenCalled();
  });

  it('redirects to login and removes token if isProfile is true but profile is null (failed fetch)', () => {
    apiHelper.getAccessToken.mockReturnValue('token');
    useSelector.mockImplementation((selector) => {
      const state = { isProfile: true, profile: null };
      return selector(state);
    });
    renderComponent();
    expect(apiHelper.removeAccessToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('renders correctly if profile exists', () => {
    apiHelper.getAccessToken.mockReturnValue('token');
    useSelector.mockImplementation((selector) => {
      const state = { isProfile: true, profile: { name: 'Test' } };
      return selector(state);
    });
    renderComponent();
    expect(screen.getByText('Test')).toBeInTheDocument(); // Navbar has the name
  });
});
