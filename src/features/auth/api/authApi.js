/* global DELCOM_BASEURL */
import apiHelper from '../../../helpers/apiHelper';

const BASE_URL =
  /* v8 ignore next */
typeof DELCOM_BASEURL !== 'undefined'
    ? DELCOM_BASEURL
    : 'https://open-api.delcom.org/api/v1';

const authApi = (() => {
  async function postRegister({ name, email, password }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    });

    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal melakukan registrasi');
    }

    return message;
  }

  async function postLogin({ email, password }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal melakukan login');
    }

    return data;
  }

  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;