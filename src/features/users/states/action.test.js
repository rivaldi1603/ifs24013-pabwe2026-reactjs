import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
  asyncSetUsers,
  asyncSetUserById,
  asyncSetProfile,
  asyncPutProfile,
  asyncPostProfilePhoto,
  asyncPutProfilePassword,
} from './action';
import userApi from '../api/userApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';

vi.mock('../api/userApi');
vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe('Users Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Action Creators', () => {
    it('should create setUsersActionCreator', () => {
      expect(setUsersActionCreator([{ id: 1 }])).toEqual({
        type: ActionType.SET_USERS,
        payload: { users: [{ id: 1 }] },
      });
    });

    it('should create setUserActionCreator', () => {
      expect(setUserActionCreator({ id: 1 })).toEqual({
        type: ActionType.SET_USER,
        payload: { user: { id: 1 } },
      });
    });

    it('should create setProfileActionCreator', () => {
      expect(setProfileActionCreator({ id: 1 })).toEqual({
        type: ActionType.SET_PROFILE,
        payload: { profile: { id: 1 } },
      });
    });

    it('should create setIsProfileActionCreator', () => {
      expect(setIsProfileActionCreator(true)).toEqual({
        type: ActionType.SET_IS_PROFILE,
        payload: { isProfile: true },
      });
    });

    it('should create setIsChangeProfileActionCreator', () => {
      expect(setIsChangeProfileActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE,
        payload: { isChangeProfile: true },
      });
    });

    it('should create setIsChangeProfilePhotoActionCreator', () => {
      expect(setIsChangeProfilePhotoActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
        payload: { isChangeProfilePhoto: true },
      });
    });

    it('should create setIsChangeProfilePasswordActionCreator', () => {
      expect(setIsChangeProfilePasswordActionCreator(true)).toEqual({
        type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
        payload: { isChangeProfilePassword: true },
      });
    });
  });

  describe('Thunks', () => {
    it('asyncSetUsers success', async () => {
      const dispatch = vi.fn();
      userApi.getUsers.mockResolvedValue([{ id: 1 }]);
      await asyncSetUsers()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([{ id: 1 }]));
    });

    it('asyncSetUsers failure', async () => {
      const dispatch = vi.fn();
      userApi.getUsers.mockRejectedValue(new Error('error'));
      await asyncSetUsers()(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([]));
    });

    it('asyncSetUserById success', async () => {
      const dispatch = vi.fn();
      userApi.getUserById.mockResolvedValue({ id: 1 });
      await asyncSetUserById(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setUserActionCreator({ id: 1 }));
    });

    it('asyncSetUserById failure', async () => {
      const dispatch = vi.fn();
      userApi.getUserById.mockRejectedValue(new Error('error'));
      await asyncSetUserById(1)(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setUserActionCreator(null));
    });

    it('asyncSetProfile success', async () => {
      const dispatch = vi.fn();
      userApi.getProfile.mockResolvedValue({ id: 1 });
      await asyncSetProfile()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
    });

    it('asyncSetProfile failure', async () => {
      const dispatch = vi.fn();
      userApi.getProfile.mockRejectedValue(new Error('error'));
      await asyncSetProfile()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
    });

    it('asyncPutProfile success', async () => {
      const dispatch = vi.fn();
      userApi.putProfile.mockResolvedValue('success');
      await asyncPutProfile({ name: 'name', email: 'email' })(dispatch);
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(true));
      expect(dispatch).toHaveBeenCalled(); // asyncSetProfile
    });

    it('asyncPutProfile failure', async () => {
      const dispatch = vi.fn();
      userApi.putProfile.mockRejectedValue(new Error('error'));
      await asyncPutProfile({ name: 'name', email: 'email' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfileActionCreator(false));
    });

    it('asyncPostProfilePhoto success', async () => {
      const dispatch = vi.fn();
      userApi.postProfilePhoto.mockResolvedValue('success');
      await asyncPostProfilePhoto('photo')(dispatch);
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePhotoActionCreator(true));
      expect(dispatch).toHaveBeenCalled(); // asyncSetProfile
    });

    it('asyncPostProfilePhoto failure', async () => {
      const dispatch = vi.fn();
      userApi.postProfilePhoto.mockRejectedValue(new Error('error'));
      await asyncPostProfilePhoto('photo')(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePhotoActionCreator(false));
    });

    it('asyncPutProfilePassword success', async () => {
      const dispatch = vi.fn();
      userApi.putProfilePassword.mockResolvedValue('success');
      await asyncPutProfilePassword({ password: 'p', new_password: 'np' })(dispatch);
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(true));
    });

    it('asyncPutProfilePassword failure', async () => {
      const dispatch = vi.fn();
      userApi.putProfilePassword.mockRejectedValue(new Error('error'));
      await asyncPutProfilePassword({ password: 'p', new_password: 'np' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsChangeProfilePasswordActionCreator(false));
    });
  });
});
