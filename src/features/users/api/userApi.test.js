import { describe, it, expect, vi, beforeEach } from 'vitest';
import userApi from './userApi';
import apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper');

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.getUsers()).rejects.toThrow('Gagal memuat pengguna');
    });
    it('should return users on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: { users: ['user1'] } }),
      });
      const response = await userApi.getUsers();
      expect(response).toEqual(['user1']);
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.getUsers()).rejects.toThrow('fail');
    });
  });

  describe('getUserById', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.getUserById('1')).rejects.toThrow('Gagal memuat detail pengguna');
    });
    it('should return user on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: { user: 'user1' } }),
      });
      const response = await userApi.getUserById('1');
      expect(response).toEqual('user1');
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.getUserById('1')).rejects.toThrow('fail');
    });
  });

  describe('getProfile', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.getProfile()).rejects.toThrow('Gagal memuat profil');
    });
    it('should return profile on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: { user: 'user1' } }),
      });
      const response = await userApi.getProfile();
      expect(response).toEqual('user1');
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.getProfile()).rejects.toThrow('fail');
    });
  });

  describe('putProfile', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.putProfile({})).rejects.toThrow('Gagal memperbarui profil');
    });
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await userApi.putProfile({ name: 'n', email: 'e' });
      expect(response).toEqual('success');
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.putProfile({ name: 'n', email: 'e' })).rejects.toThrow('fail');
    });
  });

  describe('postProfilePhoto', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.postProfilePhoto(new File([''], 'p.png'))).rejects.toThrow('Gagal mengunggah foto profil');
    });
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await userApi.postProfilePhoto(new File([''], 'photo.png'));
      expect(response).toEqual('success');
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.postProfilePhoto(new File([''], 'photo.png'))).rejects.toThrow('fail');
    });
  });

  describe('putProfilePassword', () => {
    it('should throw default error on fail without message', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
      await expect(userApi.putProfilePassword({})).rejects.toThrow('Gagal mengubah kata sandi');
    });
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await userApi.putProfilePassword({ password: 'p', new_password: 'n' });
      expect(response).toEqual('success');
    });
    it('should throw on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(userApi.putProfilePassword({ password: 'p', new_password: 'n' })).rejects.toThrow('fail');
    });
  });
});
