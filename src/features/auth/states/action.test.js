import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  setAuthUserActionCreator,
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
  asyncSetAuthLogin,
  asyncSetAuthRegister,
  asyncSetAuthLogout,
  ActionType,
} from './action';
import authApi from '../api/authApi';
import apiHelper from '../../../helpers/apiHelper';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

vi.mock('../api/authApi');
vi.mock('../../../helpers/apiHelper');
vi.mock('../../../helpers/toolsHelper');

describe('auth actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('action creators', () => {
    it('setAuthUserActionCreator', () => {
      expect(setAuthUserActionCreator('user')).toEqual({ type: ActionType.SET_AUTH_USER, payload: { authUser: 'user' } });
    });
    it('setIsAuthLoginActionCreator', () => {
      expect(setIsAuthLoginActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_LOGIN, payload: { isAuthLogin: true } });
    });
    it('setIsAuthRegisterActionCreator', () => {
      expect(setIsAuthRegisterActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_REGISTER, payload: { isAuthRegister: true } });
    });
    it('setIsAuthLogoutActionCreator', () => {
      expect(setIsAuthLogoutActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_LOGOUT, payload: { isAuthLogout: true } });
    });
  });

  describe('asyncSetAuthLogin', () => {
    it('should dispatch login success', async () => {
      const dispatch = vi.fn();
      authApi.postLogin.mockResolvedValue({ token: '123' });
      await asyncSetAuthLogin({ email: 'e', password: 'p' })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(true));
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith('123');
      expect(dispatch).toHaveBeenCalledWith(setAuthUserActionCreator('123'));
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(false));
    });
    it('should dispatch login error', async () => {
      const dispatch = vi.fn();
      authApi.postLogin.mockRejectedValue(new Error('fail'));
      await asyncSetAuthLogin({ email: 'e', password: 'p' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith('Login Gagal', 'fail');
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(false));
    });
  });

  describe('asyncSetAuthRegister', () => {
    it('should dispatch register success', async () => {
      const dispatch = vi.fn();
      authApi.postRegister.mockResolvedValue('success message');
      const res = await asyncSetAuthRegister({ name: 'n', email: 'e', password: 'p' })(dispatch);
      expect(showSuccessDialog).toHaveBeenCalledWith('Registrasi Berhasil', 'success message');
      expect(res).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(setIsAuthRegisterActionCreator(false));
    });
    it('should dispatch register error', async () => {
      const dispatch = vi.fn();
      authApi.postRegister.mockRejectedValue(new Error('fail'));
      const res = await asyncSetAuthRegister({ name: 'n', email: 'e', password: 'p' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith('Registrasi Gagal', 'fail');
      expect(res).toBe(false);
      expect(dispatch).toHaveBeenCalledWith(setIsAuthRegisterActionCreator(false));
    });
  });

  describe('asyncSetAuthLogout', () => {
    it('should dispatch logout success', async () => {
      const dispatch = vi.fn();
      await asyncSetAuthLogout()(dispatch);
      expect(apiHelper.removeAccessToken).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setAuthUserActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(false));
    });
    it('should dispatch logout error', async () => {
      const dispatch = vi.fn();
      apiHelper.removeAccessToken.mockImplementation(() => { throw new Error('fail'); });
      await asyncSetAuthLogout()(dispatch);
      expect(showErrorDialog).toHaveBeenCalledWith('Logout Gagal', 'fail');
      expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(false));
    });
  });
});
