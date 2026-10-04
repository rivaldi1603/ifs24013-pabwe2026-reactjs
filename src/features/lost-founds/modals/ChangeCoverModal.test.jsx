import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangeCoverModal from './ChangeCoverModal';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPostLostFoundCover } from '../states/action';
import { showErrorDialog } from '../../../helpers/toolsHelper';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('../states/action', () => ({
  asyncPostLostFoundCover: vi.fn(),
}));

vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
}));

describe('ChangeCoverModal', () => {
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue(false); // isLostFoundChangeCover false
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
  });

  const renderComponent = (isOpen = true) =>
    render(<ChangeCoverModal isOpen={isOpen} onClose={mockOnClose} lostFoundId={1} onSuccess={mockOnSuccess} />);

  it('renders nothing if not open', () => {
    const { container } = renderComponent(false);
    expect(container.firstChild).toBeNull();
  });

  it('does nothing if form submitted without file', async () => {
    renderComponent();
    const submitBtn = screen.getByRole('button', { name: /Unggah Foto/i });
    await userEvent.click(submitBtn);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows error if file is not an image', async () => {
    renderComponent();
    const fileInput = document.getElementById('dropzone-file'); // querySelector
    const file = new File(['text'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(showErrorDialog).toHaveBeenCalledWith('Format Tidak Valid', expect.any(String));
  });

  it('shows error if file is too large', async () => {
    renderComponent();
    const fileInput = document.getElementById('dropzone-file');
    // Create large file
    const largeFile = new File(['a'.repeat(3 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 });
    
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(showErrorDialog).toHaveBeenCalledWith('Ukuran Terlalu Besar', expect.any(String));
  });

  it('previews and dispatches upload successfully', async () => {
    mockDispatch.mockResolvedValue(true);
    renderComponent();
    const fileInput = document.getElementById('dropzone-file');
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    await userEvent.upload(fileInput, file);
    
    // Check if image preview is rendered (img element)
    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    const uploadBtn = screen.getByRole('button', { name: /Unggah Foto/i });
    await userEvent.click(uploadBtn);
    
    expect(mockDispatch).toHaveBeenCalled();
    expect(asyncPostLostFoundCover).toHaveBeenCalledWith(1, file);
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles close button', async () => {
    renderComponent();
    const cancelBtn = screen.getByRole('button', { name: /Batal/i });
    await userEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
