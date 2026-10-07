import { ActionType } from './action';

function authUserReducer(state = null, action = {}) {
  if (action.type === ActionType.SET_AUTH_USER) {
    return action.payload.authUser;
  }
  return state;
}

function isAuthLoginReducer(state = false, action = {}) {
  if (action.type === ActionType.SET_IS_AUTH_LOGIN) {
    return action.payload.isAuthLogin;
  }
  return state;
}

function isAuthRegisterReducer(state = false, action = {}) {
  if (action.type === ActionType.SET_IS_AUTH_REGISTER) {
    return action.payload.isAuthRegister;
  }
  return state;
}

function isAuthLogoutReducer(state = false, action = {}) {
  if (action.type === ActionType.SET_IS_AUTH_LOGOUT) {
    return action.payload.isAuthLogout;
  }
  return state;
}

export {
  authUserReducer,
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
};
