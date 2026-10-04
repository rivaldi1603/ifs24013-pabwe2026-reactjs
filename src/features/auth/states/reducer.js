import { ActionType } from './action';

function authUserReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_AUTH_USER:
      return action.payload.authUser;
    default:
      return state;
  }
}

function isAuthLoginReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGIN:
      return action.payload.isAuthLogin;
    default:
      return state;
  }
}

function isAuthRegisterReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_REGISTER:
      return action.payload.isAuthRegister;
    default:
      return state;
  }
}

function isAuthLogoutReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_AUTH_LOGOUT:
      return action.payload.isAuthLogout;
    default:
      return state;
  }
}

export {
  authUserReducer,
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
};
