import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangeModal from './ChangeModal';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPutLostFound } from '../states/action';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncPutLostFound: vi.fn(),
}));

describe('ChangeModal', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  
  const mockLostFound = {
    id: 1,
    title: 'Old Title',
    description: 'Old Desc',
    status: 'lost',
    is_completed: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue(false); // isLostFoundChange false
  });

  const renderComponent = (isOpen = true, lf = mockLostFound) =>
    render(<ChangeModal isOpen={isOpen} onClose={mockOnClose} lostFound={lf} onSuccess={mockOnSuccess} />);

  it('renders nothing if not open or no lostFound', () => {
    const { container } = renderComponent(false);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with pre-filled data', () => {
    renderComponent();
    expect(screen.getByLabelText('Judul Laporan')).toHaveValue('Old Title');
    expect(screen.getByLabelText('Deskripsi Detail')).toHaveValue('Old Desc');
    expect(screen.getByLabelText('Kehilangan (Lost)')).toBeChecked();
    expect(screen.getByLabelText(/Tandai sebagai selesai/i)).not.toBeChecked(); // is_completed
  });

  it('handles input changes and dispatch successfully', async () => {
    mockDispatch.mockResolvedValue(true);
    renderComponent();
    const titleInput = screen.getByLabelText('Judul Laporan');
    const descInput = screen.getByLabelText('Deskripsi Detail');
    const radioFound = screen.getByLabelText('Menemukan (Found)');
    const checkboxCompleted = screen.getByLabelText(/Tandai sebagai selesai/i);
    
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'New Title');
    
    await userEvent.clear(descInput);
    await userEvent.type(descInput, 'New Desc');
    
    await userEvent.click(radioFound);
    await userEvent.click(checkboxCompleted);

    const submitBtn = screen.getByRole('button', { name: /Simpan Perubahan/i });
    await userEvent.click(submitBtn);

    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPutLostFound).toHaveBeenCalledWith(1, {
      title: 'New Title',
      description: 'New Desc',
      status: 'found',
      is_completed: 1,
    });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles cancellation', async () => {
    renderComponent();
    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    await userEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
