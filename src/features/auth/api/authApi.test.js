import { describe, it, expect, vi, beforeEach } from 'vitest';
import authApi from './authApi';
import apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper');

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('postRegister', () => {
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'Register success' }),
      });
      const response = await authApi.postRegister({ name: 'n', email: 'e', password: 'p' });
      expect(response).toBe('Register success');
    });

    it('sends explicit password_confirmation and accepts status "success"', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ status: 'success', message: 'Berhasil' }),
      });
      const response = await authApi.postRegister({
        name: 'n', email: 'e', password: 'secret123', passwordConfirmation: 'secret123',
      });
      expect(response).toBe('Berhasil');
      const body = JSON.parse(apiHelper.fetchWithAuth.mock.calls[0][1].body);
      expect(body).toEqual({
        name: 'n', email: 'e', password: 'secret123', password_confirmation: 'secret123',
      });
    });

    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Register failed' }),
      });
      await expect(authApi.postRegister({ name: 'n', email: 'e', password: 'p' })).rejects.toThrow('Register failed');
    });

    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });
      await expect(authApi.postRegister({ name: 'n', email: 'e', password: 'p' })).rejects.toThrow('Gagal melakukan registrasi');
    });
  });

  describe('postLogin', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'Login success', data: 'token_data' }),
      });
      const response = await authApi.postLogin({ email: 'e', password: 'p' });
      expect(response).toBe('token_data');
    });

    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Login failed' }),
      });
      await expect(authApi.postLogin({ email: 'e', password: 'p' })).rejects.toThrow('Login failed');
    });

    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false }),
      });
      await expect(authApi.postLogin({ email: 'e', password: 'p' })).rejects.toThrow('Gagal melakukan login');
    });
  });
});
