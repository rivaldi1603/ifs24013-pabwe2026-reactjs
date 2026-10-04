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

    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Register failed' }),
      });
      await expect(authApi.postRegister({ name: 'n', email: 'e', password: 'p' })).rejects.toThrow('Register failed');
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
  });
});
