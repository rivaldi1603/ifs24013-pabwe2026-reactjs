import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavbarComponent from './NavbarComponent';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showConfirmDialog } from '../../../helpers/toolsHelper';
import { asyncSetAuthLogout } from '../../auth/states/action';

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

vi.mock('../../../helpers/toolsHelper', () => ({
  showConfirmDialog: vi.fn(),
}));

vi.mock('../../auth/states/action', () => ({
  asyncSetAuthLogout: vi.fn(),
}));

describe('NavbarComponent', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const toggleSidebar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useSelector.mockImplementation((selector) =>
      selector({ profile: { name: 'Test User', email: 'test@example.com', photo: '' } })
    );
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <NavbarComponent toggleSidebar={toggleSidebar} />
      </MemoryRouter>
    );

  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Lost & Founds')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('toggles sidebar on menu button click', async () => {
    renderComponent();
    // The menu button is the first button in the nav, or we can find it by its lack of text (it has an icon)
    // Actually, there's only a few buttons: menu, dropdown.
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[0]); // The hamburger menu button
    expect(toggleSidebar).toHaveBeenCalled();
  });

  it('closes dropdown when clicking Profil Saya', async () => {
    renderComponent();
    const avatarBtn = screen.getByRole('button', { name: /Test User/i });
    await userEvent.click(avatarBtn);
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    const profileLink = screen.getByText('Profil Saya');
    await userEvent.click(profileLink);
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('toggles dropdown and handles logout', async () => {
    showConfirmDialog.mockResolvedValue(true); // User confirms logout
    
    renderComponent();
    const dropdownBtn = screen.getByRole('button', { name: /Test User/i });
    
    // Open dropdown
    await userEvent.click(dropdownBtn);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Click logout
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    await userEvent.click(logoutBtn);
    
    expect(showConfirmDialog).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncSetAuthLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  it('handles logout cancel', async () => {
    showConfirmDialog.mockResolvedValue(false); // User cancels logout
    
    renderComponent();
    const dropdownBtn = screen.getByRole('button', { name: /Test User/i });
    
    // Open dropdown
    await userEvent.click(dropdownBtn);
    
    // Click logout
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    await userEvent.click(logoutBtn);
    
    expect(showConfirmDialog).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders fallbacks when profile is empty', async () => {
    useSelector.mockImplementation((selector) => selector({ profile: null }));
    renderComponent();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByAltText('User')).toHaveAttribute(
      'src',
      'https://ui-avatars.com/api/?name=U'
    );
    await userEvent.click(screen.getByRole('button', { name: /User/i }));
    expect(screen.getAllByText('-')).toHaveLength(2);
  });

  it('uses profile photo when available', () => {
    useSelector.mockImplementation((selector) =>
      selector({ profile: { name: 'A', email: 'a@a.com', photo: 'http://img/p.png' } })
    );
    renderComponent();
    expect(screen.getByAltText('A')).toHaveAttribute('src', 'http://img/p.png');
  });
});
