import authApi from '../api/authApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';
import apiHelper from '../../../helpers/apiHelper';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  SET_IS_AUTH_LOGIN: 'SET_IS_AUTH_LOGIN',
  SET_IS_AUTH_REGISTER: 'SET_IS_AUTH_REGISTER',
  SET_IS_AUTH_LOGOUT: 'SET_IS_AUTH_LOGOUT',
};

function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: { authUser },
  };
}

function setIsAuthLoginActionCreator(isAuthLogin) {
  return {
    type: ActionType.SET_IS_AUTH_LOGIN,
    payload: { isAuthLogin },
  };
}

function setIsAuthRegisterActionCreator(isAuthRegister) {
  return {
    type: ActionType.SET_IS_AUTH_REGISTER,
    payload: { isAuthRegister },
  };
}

function setIsAuthLogoutActionCreator(isAuthLogout) {
  return {
    type: ActionType.SET_IS_AUTH_LOGOUT,
    payload: { isAuthLogout },
  };
}

function asyncSetAuthLogin({ email, password }) {
  return async (dispatch) => {
    dispatch(setIsAuthLoginActionCreator(true));
    try {
      const data = await authApi.postLogin({ email, password });
      apiHelper.putAccessToken(data.token);
      dispatch(setAuthUserActionCreator(data.token)); // or data.user depending on API, but token is fine to trigger login.
      dispatch(setIsAuthLoginActionCreator(false));
      showSuccessDialog('Login Berhasil', 'Selamat datang!');
    } catch (error) {
      dispatch(setIsAuthLoginActionCreator(false));
      showErrorDialog('Login Gagal', error.message);
    }
  };
}

function asyncSetAuthRegister({ name, email, password }) {
  return async (dispatch) => {
    dispatch(setIsAuthRegisterActionCreator(true));
    try {
      const message = await authApi.postRegister({ name, email, password });
      dispatch(setIsAuthRegisterActionCreator(false));
      await showSuccessDialog('Registrasi Berhasil', message);
      return true; // Used to redirect to login
    } catch (error) {
      dispatch(setIsAuthRegisterActionCreator(false));
      showErrorDialog('Registrasi Gagal', error.message);
      return false;
    }
  };
}

function asyncSetAuthLogout() {
  return async (dispatch) => {
    dispatch(setIsAuthLogoutActionCreator(true));
    try {
      apiHelper.removeAccessToken();
      dispatch(setAuthUserActionCreator(null));
      dispatch(setIsAuthLogoutActionCreator(false));
    } catch (error) {
      dispatch(setIsAuthLogoutActionCreator(false));
      showErrorDialog('Logout Gagal', error.message);
    }
  };
}

export {
  ActionType,
  setAuthUserActionCreator,
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
  asyncSetAuthLogin,
  asyncSetAuthRegister,
  asyncSetAuthLogout,
};
