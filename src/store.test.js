import { describe, it, expect } from 'vitest';
import store from './store';

describe('Redux Store', () => {
  it('should configure and initialize the store correctly with root reducer', () => {
    const state = store.getState();
    
    // Check if auth reducers are present
    expect(state).toHaveProperty('authUser');
    expect(state).toHaveProperty('isAuthLogin');
    
    // Check if users reducers are present
    expect(state).toHaveProperty('users');
    expect(state).toHaveProperty('profile');
    
    // Check if lost-founds reducers are present
    expect(state).toHaveProperty('lostFounds');
    expect(state).toHaveProperty('lostFound');
    
    // Default initial states
    expect(state.authUser).toBeNull();
    expect(state.isAuthLogin).toBe(false);
    expect(state.users).toEqual([]);
    expect(state.lostFounds).toEqual([]);
  });
});
