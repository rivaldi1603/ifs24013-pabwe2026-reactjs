import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddModal from './AddModal';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPostLostFound } from '../states/action';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncPostLostFound: vi.fn(),
}));

describe('AddModal', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) => selector({ isLostFoundAdd: false }));
  });

  const renderComponent = (isOpen = true) =>
    render(<AddModal isOpen={isOpen} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

  it('renders nothing if not open', () => {
    const { container } = renderComponent(false);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content', () => {
    renderComponent();
    expect(screen.getByText('Tambah Laporan Baru')).toBeInTheDocument();
  });

  it('allows user to type in inputs and toggle radio', async () => {
    renderComponent();
    const titleInput = screen.getByLabelText('Judul Laporan');
    const descInput = screen.getByLabelText('Deskripsi Detail');
    const radioFound = screen.getByLabelText('Menemukan (Found)');
    const radioLost = screen.getByLabelText('Kehilangan (Lost)');

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descInput, 'Test Desc');
    await userEvent.click(radioFound);

    expect(titleInput).toHaveValue('Test Title');
    expect(descInput).toHaveValue('Test Desc');
    expect(radioFound).toBeChecked();
    expect(radioLost).not.toBeChecked();

    await userEvent.click(radioLost);
    expect(radioLost).toBeChecked();
    expect(radioFound).not.toBeChecked();
  });

  it('submits without onSuccess callback', async () => {
    mockDispatch.mockResolvedValue(true);
    render(<AddModal isOpen onClose={mockOnClose} />);
    await userEvent.type(screen.getByLabelText('Judul Laporan'), 'T');
    await userEvent.type(screen.getByLabelText('Deskripsi Detail'), 'D');
    await userEvent.click(screen.getByRole('button', { name: /Simpan Laporan/i }));
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not dispatch if required fields missing', async () => {
    renderComponent();
    const submitBtn = screen.getByRole('button', { name: /Simpan Laporan/i });
    await userEvent.click(submitBtn);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('dispatches action on submit', async () => {
    mockDispatch.mockResolvedValue(true);
    renderComponent();
    const titleInput = screen.getByLabelText('Judul Laporan');
    const descInput = screen.getByLabelText('Deskripsi Detail');
    const submitBtn = screen.getByRole('button', { name: /Simpan Laporan/i });

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descInput, 'Test Desc');
    await userEvent.click(submitBtn);

    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPostLostFound).toHaveBeenCalledWith({ title: 'Test Title', description: 'Test Desc', status: 'lost' });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading state when submitting', () => {
    useSelector.mockImplementation((selector) => selector({ isLostFoundAdd: true }));
    renderComponent();
    // Use getAllByRole to get submit button
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons[buttons.length - 1]; // last button
    expect(submitBtn).toBeDisabled();
  });

  it('calls onClose when close button is clicked', async () => {
    renderComponent();
    const buttons = screen.getAllByRole('button');
    const closeBtn = buttons[0]; // first button is close
    await userEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
  
  it('calls onClose when cancel button is clicked', async () => {
    renderComponent();
    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    await userEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
