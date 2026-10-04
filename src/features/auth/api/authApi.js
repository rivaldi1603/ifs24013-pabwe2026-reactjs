import apiHelper from '../../../helpers/apiHelper';
import { getBaseUrl } from '../../../helpers/baseUrl';
import { parseApiResponse } from '../../../helpers/responseHelper';

const BASE_URL = getBaseUrl();

const authApi = (() => {
  async function postRegister({ name, email, password, passwordConfirmation }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation ?? password,
      }),
    });

    const responseJson = await response.json();
    const { message } = parseApiResponse(responseJson, 'Gagal melakukan registrasi');
    return message;
  }

  async function postLogin({ email, password }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    const { data } = parseApiResponse(responseJson, 'Gagal melakukan login');
    return data;
  }

  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;