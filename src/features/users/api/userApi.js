/* global DELCOM_BASEURL */
import apiHelper from '../../../helpers/apiHelper';

const BASE_URL =
  typeof DELCOM_BASEURL !== 'undefined'
    ? DELCOM_BASEURL
    : 'https://open-api.delcom.org/api/v1';

const userApi = (() => {
  async function getUsers() {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users`);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal memuat pengguna');
    }

    return data.users;
  }

  async function getUserById(id) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users/${id}`);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal memuat detail pengguna');
    }

    return data.user;
  }

  async function getProfile() {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users/me`);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal memuat profil');
    }

    return data.user;
  }

  async function putProfile({ name, email }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users/me`, {
      method: 'PUT',
      body: JSON.stringify({ name, email }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal memperbarui profil');
    }

    return message;
  }

  async function postProfilePhoto(photo) {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users/me/photo`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal mengunggah foto profil');
    }

    return message;
  }

  async function putProfilePassword({ password, new_password }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/users/me/password`, {
      method: 'PUT',
      body: JSON.stringify({ password, new_password }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!response.ok) {
      throw new Error(message || 'Gagal mengubah kata sandi');
    }

    return message;
  }

  return {
    getUsers,
    getUserById,
    getProfile,
    putProfile,
    postProfilePhoto,
    putProfilePassword,
  };
})();

export default userApi;
