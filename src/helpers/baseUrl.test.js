import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiHelper from './apiHelper';

vi.mock('./apiHelper');

describe('Base URL Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    global.DELCOM_BASEURL = 'https://custom-api.com/api/v1';
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete global.DELCOM_BASEURL;
  });

  it('authApi uses DELCOM_BASEURL', async () => {
    const authApi = (await import('../features/auth/api/authApi')).default;
    apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
    await expect(authApi.postLogin({ email: '', password: '' })).rejects.toThrow();
    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      'https://custom-api.com/api/v1/auth/login',
      expect.any(Object)
    );
  });

  it('userApi uses DELCOM_BASEURL', async () => {
    const userApi = (await import('../features/users/api/userApi')).default;
    apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
    await expect(userApi.getUsers()).rejects.toThrow();
    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      'https://custom-api.com/api/v1/users'
    );
  });

  it('lostFoundApi uses DELCOM_BASEURL', async () => {
    const lostFoundApi = (await import('../features/lost-founds/api/lostFoundApi')).default;
    apiHelper.fetchWithAuth.mockResolvedValue({ json: () => Promise.resolve({ success: false }) });
    await expect(lostFoundApi.getLostFoundById('1')).rejects.toThrow();
    expect(apiHelper.fetchWithAuth).toHaveBeenCalledWith(
      'https://custom-api.com/api/v1/lost-founds/1'
    );
  });
});
