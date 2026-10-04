import { describe, it, expect } from 'vitest';
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from './reducer';
import { ActionType } from './action';

describe('usersReducers', () => {
  it('usersReducer', () => {
    expect(usersReducer(undefined, {})).toEqual([]);
    expect(usersReducer([], { type: ActionType.SET_USERS, payload: { users: ['u1'] } })).toEqual(['u1']);
  });
  it('userReducer', () => {
    expect(userReducer(undefined, {})).toBeNull();
    expect(userReducer(null, { type: ActionType.SET_USER, payload: { user: 'u1' } })).toEqual('u1');
  });
  it('profileReducer', () => {
    expect(profileReducer(undefined, {})).toBeNull();
    expect(profileReducer(null, { type: ActionType.SET_PROFILE, payload: { profile: 'p1' } })).toEqual('p1');
  });
  it('isProfileReducer', () => {
    expect(isProfileReducer(undefined, {})).toBe(false);
    expect(isProfileReducer(false, { type: ActionType.SET_IS_PROFILE, payload: { isProfile: true } })).toBe(true);
  });
  it('isChangeProfileReducer', () => {
    expect(isChangeProfileReducer(undefined, {})).toBe(false);
    expect(isChangeProfileReducer(false, { type: ActionType.SET_IS_CHANGE_PROFILE, payload: { isChangeProfile: true } })).toBe(true);
  });
  it('isChangeProfilePhotoReducer', () => {
    expect(isChangeProfilePhotoReducer(undefined, {})).toBe(false);
    expect(isChangeProfilePhotoReducer(false, { type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: { isChangeProfilePhoto: true } })).toBe(true);
  });
  it('isChangeProfilePasswordReducer', () => {
    expect(isChangeProfilePasswordReducer(undefined, {})).toBe(false);
    expect(isChangeProfilePasswordReducer(false, { type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD, payload: { isChangeProfilePassword: true } })).toBe(true);
  });
});
