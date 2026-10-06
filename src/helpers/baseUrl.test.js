import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import apiHelper from './apiHelper';

vi.mock('./apiHelper');

describe('Base URL Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    globalThis.DELCOM_BASEURL = 'https://custom-api.com/api/v1';
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete globalThis.DELCOM_BASEURL;
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

  it('getBaseUrl returns DELCOM_BASEURL when defined', async () => {
    const { getBaseUrl } = await import('./baseUrl');
    expect(getBaseUrl()).toBe('https://custom-api.com/api/v1');
  });

  it('getBaseUrl falls back to default URL when DELCOM_BASEURL is undefined', async () => {
    const original = globalThis.DELCOM_BASEURL;
    delete globalThis.DELCOM_BASEURL;
    const { getBaseUrl, DEFAULT_BASE_URL } = await import('./baseUrl');
    expect(getBaseUrl()).toBe(DEFAULT_BASE_URL);
    expect(DEFAULT_BASE_URL).toBe('https://open-api.delcom.org/api/v1');
    globalThis.DELCOM_BASEURL = original;
  });
});
