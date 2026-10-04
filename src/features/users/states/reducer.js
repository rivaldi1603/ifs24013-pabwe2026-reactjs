import { ActionType } from './action';

function usersReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.SET_USERS:
      return action.payload.users;
    default:
      return state;
  }
}

function userReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_USER:
      return action.payload.user;
    default:
      return state;
  }
}

function profileReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_PROFILE:
      return action.payload.profile;
    default:
      return state;
  }
}

function isProfileReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_PROFILE:
      return action.payload.isProfile;
    default:
      return state;
  }
}

function isChangeProfileReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE:
      return action.payload.isChangeProfile;
    default:
      return state;
  }
}

function isChangeProfilePhotoReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PHOTO:
      return action.payload.isChangeProfilePhoto;
    default:
      return state;
  }
}

function isChangeProfilePasswordReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_CHANGE_PROFILE_PASSWORD:
      return action.payload.isChangeProfilePassword;
    default:
      return state;
  }
}

export {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
};