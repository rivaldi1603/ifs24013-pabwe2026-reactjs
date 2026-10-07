import userApi from '../api/userApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';

const ActionType = {
  SET_USERS: 'SET_USERS',
  SET_USER: 'SET_USER',
  SET_PROFILE: 'SET_PROFILE',
  SET_IS_PROFILE: 'SET_IS_PROFILE',
  SET_IS_CHANGE_PROFILE: 'SET_IS_CHANGE_PROFILE',
  SET_IS_CHANGE_PROFILE_PHOTO: 'SET_IS_CHANGE_PROFILE_PHOTO',
  SET_IS_CHANGE_PROFILE_PASSWORD: 'SET_IS_CHANGE_PROFILE_PASSWORD', // nosonar
};

function setUsersActionCreator(users) {
  return {
    type: ActionType.SET_USERS,
    payload: { users },
  };
}

function setUserActionCreator(user) {
  return {
    type: ActionType.SET_USER,
    payload: { user },
  };
}

function setProfileActionCreator(profile) {
  return {
    type: ActionType.SET_PROFILE,
    payload: { profile },
  };
}

function setIsProfileActionCreator(isProfile) {
  return {
    type: ActionType.SET_IS_PROFILE,
    payload: { isProfile },
  };
}

function setIsChangeProfileActionCreator(isChangeProfile) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: { isChangeProfile },
  };
}

function setIsChangeProfilePhotoActionCreator(isChangeProfilePhoto) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: { isChangeProfilePhoto },
  };
}

function setIsChangeProfilePasswordActionCreator(isChangeProfilePassword) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: { isChangeProfilePassword },
  };
}

function asyncSetUsers() {
  return async (dispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memuat Pengguna', error.message);
      dispatch(setUsersActionCreator([]));
    }
  };
}

function asyncSetUserById(userId) {
  return async (dispatch) => {
    try {
      const user = await userApi.getUserById(userId);
      dispatch(setUserActionCreator(user));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memuat Detail Pengguna', error.message);
      dispatch(setUserActionCreator(null));
    }
  };
}

function asyncSetProfile() {
  return async (dispatch) => {
    try {
      const profile = await userApi.getProfile();
      dispatch(setProfileActionCreator(profile));
      dispatch(setIsProfileActionCreator(true));
    } catch (error) {
      console.error(error);
      dispatch(setProfileActionCreator(null));
      dispatch(setIsProfileActionCreator(true));
    }
  };
}

function asyncPutProfile({ name, email }) {
  return async (dispatch) => {
    try {
      const message = await userApi.putProfile({ name, email });
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsChangeProfileActionCreator(true));
      dispatch(asyncSetProfile());
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memperbarui Profil', error.message);
      dispatch(setIsChangeProfileActionCreator(false));
    }
  };
}

function asyncPostProfilePhoto(photo) {
  return async (dispatch) => {
    try {
      const message = await userApi.postProfilePhoto(photo);
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsChangeProfilePhotoActionCreator(true));
      dispatch(asyncSetProfile());
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Mengunggah Foto', error.message);
      dispatch(setIsChangeProfilePhotoActionCreator(false));
    }
  };
}

function asyncPutProfilePassword({ password, new_password }) {
  return async (dispatch) => {
    try {
      const message = await userApi.putProfilePassword({
        password,
        new_password,
      });
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsChangeProfilePasswordActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Mengubah Kata Sandi', error.message);
      dispatch(setIsChangeProfilePasswordActionCreator(false));
    }
  };
}

export {
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
};