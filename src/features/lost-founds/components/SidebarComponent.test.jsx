import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarComponent from './SidebarComponent';
import { MemoryRouter } from 'react-router-dom';

describe('SidebarComponent', () => {
  const renderComponent = (isOpen = true, closeSidebar = vi.fn()) => {
    render(
      <MemoryRouter>
        <SidebarComponent isOpen={isOpen} closeSidebar={closeSidebar} />
      </MemoryRouter>
    );
  };

  it('renders correctly', () => {
    renderComponent(true);
    expect(screen.getByText('Dashboard Laporan')).toBeInTheDocument();
    expect(screen.getByText('Statistik')).toBeInTheDocument();
    expect(screen.getByText('Daftar Pengguna')).toBeInTheDocument();
    expect(screen.getByText('Profil Saya')).toBeInTheDocument();
  });

  it('calls closeSidebar when overlay is clicked (mobile)', async () => {
    const closeSidebar = vi.fn();
    renderComponent(true, closeSidebar);
    // The overlay is a div, we can query it by looking for the sibling or we can just find it by a test id or class.
    // It's the first div with bg-slate-900/50.
    const overlay = document.querySelector('.bg-slate-900\\/50');
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay);
    expect(closeSidebar).toHaveBeenCalled();
  });

  it('calls closeSidebar when a nav link is clicked', async () => {
    const closeSidebar = vi.fn();
    renderComponent(true, closeSidebar);
    
    const dashboardLink = screen.getByText('Dashboard Laporan');
    await userEvent.click(dashboardLink);
    expect(closeSidebar).toHaveBeenCalled();
  });
});
