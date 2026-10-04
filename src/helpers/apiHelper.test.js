import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiHelper from './apiHelper';

describe('apiHelper', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should store token in localStorage', () => {
    apiHelper.putAccessToken('dummy_token');
    expect(localStorage.getItem('accessToken')).toBe('dummy_token');
  });

  it('should retrieve token from localStorage', () => {
    localStorage.setItem('accessToken', 'dummy_token');
    const token = apiHelper.getAccessToken();
    expect(token).toBe('dummy_token');
  });

  it('should remove token from localStorage', () => {
    localStorage.setItem('accessToken', 'dummy_token');
    apiHelper.removeAccessToken();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});
