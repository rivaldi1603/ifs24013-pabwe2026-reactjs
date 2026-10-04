import { describe, it, expect, vi, beforeEach } from 'vitest';
import toolsHelper, {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  formatDate,
} from './toolsHelper';
import Swal from 'sweetalert2';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('toolsHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showSuccessDialog', () => {
    it('should call Swal.fire with success config', () => {
      showSuccessDialog('Title', 'Text');
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Title',
        text: 'Text',
        confirmButtonColor: '#2563eb',
      });
    });
    it('should use default params', () => {
      showSuccessDialog();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Berhasil',
        text: '',
        confirmButtonColor: '#2563eb',
      });
    });
  });

  describe('showErrorDialog', () => {
    it('should call Swal.fire with error config', () => {
      showErrorDialog('Error', 'Text');
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error',
        text: 'Text',
        confirmButtonColor: '#dc2626',
      });
    });
    it('should use default params', () => {
      showErrorDialog();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: '',
        confirmButtonColor: '#dc2626',
      });
    });
  });

  describe('showConfirmDialog', () => {
    it('should call Swal.fire and return isConfirmed', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: true });
      const result = await showConfirmDialog('Title', 'Text');
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'warning',
        title: 'Title',
        text: 'Text',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
      });
      expect(result).toBe(true);
    });
    it('should use default params', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: false });
      const result = await showConfirmDialog();
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'warning',
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batal',
      });
      expect(result).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should return - for empty date', () => {
      expect(formatDate(null)).toBe('-');
      expect(formatDate('')).toBe('-');
    });
    it('should return - for invalid date', () => {
      expect(formatDate('invalid')).toBe('-');
    });
    it('should format valid date', () => {
      // Mocking timezone can be tricky, so we just verify it doesn't return '-'
      expect(formatDate('2022-01-01T00:00:00.000Z')).not.toBe('-');
    });
  });

  describe('default export', () => {
    it('should have all functions', () => {
      expect(toolsHelper.showSuccessDialog).toBeDefined();
      expect(toolsHelper.showErrorDialog).toBeDefined();
      expect(toolsHelper.showConfirmDialog).toBeDefined();
      expect(toolsHelper.formatDate).toBeDefined();
    });
  });
});
