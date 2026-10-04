import { describe, it, expect } from 'vitest';
import {
  authUserReducer,
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from './reducer';
import { ActionType } from './action';

describe('authReducers', () => {
  describe('authUserReducer', () => {
    it('should return initial state', () => {
      expect(authUserReducer(undefined, {})).toBeNull();
    });
    it('should handle SET_AUTH_USER', () => {
      expect(
        authUserReducer(null, {
          type: ActionType.SET_AUTH_USER,
          payload: { authUser: 'user' },
        })
      ).toBe('user');
    });
  });

  describe('isAuthLoginReducer', () => {
    it('should return initial state', () => {
      expect(isAuthLoginReducer(undefined, {})).toBe(false);
    });
    it('should handle SET_IS_AUTH_LOGIN', () => {
      expect(
        isAuthLoginReducer(false, {
          type: ActionType.SET_IS_AUTH_LOGIN,
          payload: { isAuthLogin: true },
        })
      ).toBe(true);
    });
  });

  describe('isAuthRegisterReducer', () => {
    it('should return initial state', () => {
      expect(isAuthRegisterReducer(undefined, {})).toBe(false);
    });
    it('should handle SET_IS_AUTH_REGISTER', () => {
      expect(
        isAuthRegisterReducer(false, {
          type: ActionType.SET_IS_AUTH_REGISTER,
          payload: { isAuthRegister: true },
        })
      ).toBe(true);
    });
  });

  describe('isAuthLogoutReducer', () => {
    it('should return initial state', () => {
      expect(isAuthLogoutReducer(undefined, {})).toBe(false);
    });
    it('should handle SET_IS_AUTH_LOGOUT', () => {
      expect(
        isAuthLogoutReducer(false, {
          type: ActionType.SET_IS_AUTH_LOGOUT,
          payload: { isAuthLogout: true },
        })
      ).toBe(true);
    });
  });
});
