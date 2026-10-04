import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import AuthLayout from './AuthLayout';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiHelper from '../../../helpers/apiHelper';

vi.mock('react-redux', () => ({
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
  default: { getAccessToken: vi.fn() }
}));

describe('AuthLayout', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render successfully', () => {
    useSelector.mockReturnValue(null);
    apiHelper.getAccessToken.mockReturnValue(null);
    const { container } = render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('redirects if user is authenticated', () => {
    useSelector.mockReturnValue('user');
    apiHelper.getAccessToken.mockReturnValue('token');
    render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
