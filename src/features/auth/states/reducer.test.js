import { describe, it, expect } from 'vitest';
import {
  authUserReducer,
  isAuthLoginReducer,
} from './reducer';
import { ActionType } from './action';

describe('Auth Reducers', () => {
  describe('authUserReducer', () => {
    it('should return initial state when state is undefined', () => {
      const initialState = authUserReducer(undefined, { type: 'UNKNOWN' });
      expect(initialState).toBeNull();
    });

    it('should handle SET_AUTH_USER', () => {
      const action = {
        type: ActionType.SET_AUTH_USER,
        payload: { authUser: 'dummy-token' },
      };
      const state = authUserReducer(null, action);
      expect(state).toBe('dummy-token');
    });
  });

  describe('isAuthLoginReducer', () => {
    it('should return initial state when state is undefined', () => {
      const initialState = isAuthLoginReducer(undefined, { type: 'UNKNOWN' });
      expect(initialState).toBe(false);
    });

    it('should handle SET_IS_AUTH_LOGIN', () => {
      const action = {
        type: ActionType.SET_IS_AUTH_LOGIN,
        payload: { isAuthLogin: true },
      };
      const state = isAuthLoginReducer(false, action);
      expect(state).toBe(true);
    });
  });
});
