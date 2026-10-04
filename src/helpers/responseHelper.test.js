import { describe, it, expect } from 'vitest';
import { isSuccessResponse, getErrorMessage, parseApiResponse } from './responseHelper';

describe('responseHelper', () => {
  describe('isSuccessResponse', () => {
    it('returns true for status "success" (Delcom API format)', () => {
      expect(isSuccessResponse({ status: 'success' })).toBe(true);
    });

    it('returns true for success: true', () => {
      expect(isSuccessResponse({ success: true })).toBe(true);
    });

    it('returns false for status "fail"', () => {
      expect(isSuccessResponse({ status: 'fail' })).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('uses message and appends validation details', () => {
      const msg = getErrorMessage(
        {
          status: 'fail',
          message: 'Data tidak valid',
          data: { email: ['The email has already been taken.'], password: ['Too short.'] },
        },
        'fallback'
      );
      expect(msg).toBe('Data tidak valid: The email has already been taken. Too short.');
    });

    it('uses fallback when message is missing and data is absent', () => {
      expect(getErrorMessage({ status: 'fail' }, 'fallback')).toBe('fallback');
    });

    it('ignores non-string details', () => {
      expect(getErrorMessage({ message: 'Err', data: { a: [1, null] } }, 'fb')).toBe('Err');
    });

    it('ignores non-object data', () => {
      expect(getErrorMessage({ message: 'Err', data: 'text' }, 'fb')).toBe('Err');
    });
  });

  describe('parseApiResponse', () => {
    it('returns the json on success', () => {
      const json = { status: 'success', message: 'ok', data: { token: 't' } };
      expect(parseApiResponse(json, 'fb')).toBe(json);
    });

    it('throws on failure', () => {
      expect(() => parseApiResponse({ status: 'fail', message: 'Nope' }, 'fb')).toThrow('Nope');
    });
  });
});
