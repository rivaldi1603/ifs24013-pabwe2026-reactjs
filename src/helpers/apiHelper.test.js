import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiHelper from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('putAccessToken', () => {
    it('should store token in localStorage', () => {
      apiHelper.putAccessToken('my-token');
      expect(localStorage.getItem('accessToken')).toBe('my-token');
    });
  });

  describe('getAccessToken', () => {
    it('should retrieve token from localStorage', () => {
      localStorage.setItem('accessToken', 'my-token');
      expect(apiHelper.getAccessToken()).toBe('my-token');
    });
  });

  describe('removeAccessToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('accessToken', 'my-token');
      apiHelper.removeAccessToken();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('fetchWithAuth', () => {
    it('should add Authorization header if token exists', async () => {
      localStorage.setItem('accessToken', 'my-token');
      fetch.mockResolvedValue('response');
      await apiHelper.fetchWithAuth('http://example.com');
      expect(fetch).toHaveBeenCalledWith('http://example.com', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer my-token',
        },
      });
    });

    it('should not override headers for FormData', async () => {
      localStorage.setItem('accessToken', 'my-token');
      fetch.mockResolvedValue('response');
      const formData = new FormData();
      await apiHelper.fetchWithAuth('http://example.com', {
        body: formData,
        headers: {
          Custom: 'header',
        },
      });
      expect(fetch).toHaveBeenCalledWith('http://example.com', {
        body: formData,
        headers: {
          Custom: 'header',
          Authorization: 'Bearer my-token',
        },
      });
    });

    it('should handle no token', async () => {
      fetch.mockResolvedValue('response');
      await apiHelper.fetchWithAuth('http://example.com', {
        headers: { Custom: 'header' },
      });
      expect(fetch).toHaveBeenCalledWith('http://example.com', {
        headers: {
          'Content-Type': 'application/json',
          Custom: 'header',
        },
      });
    });
  });
});
