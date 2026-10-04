/* global DELCOM_BASEURL */
import apiHelper from '../../../helpers/apiHelper';

const BASE_URL =
  typeof DELCOM_BASEURL !== 'undefined'
    ? DELCOM_BASEURL
    : 'https://open-api.delcom.org/api/v1';

const lostFoundApi = (() => {
  async function getLostFounds(params = {}) {
    const query = new URLSearchParams();

    if (params.status) query.append('status', params.status);
    if (params.is_completed !== undefined && params.is_completed !== '') {
      query.append('is_completed', params.is_completed);
    }
    if (params.is_me) query.append('is_me', params.is_me);

    const queryString = query.toString();
    const url = `${BASE_URL}/lost-founds${queryString ? `?${queryString}` : ''}`;

    const response = await apiHelper.fetchWithAuth(url);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal mengambil daftar Lost & Founds');
    }

    return data.lost_founds || [];
  }

  async function getLostFoundById(lostFoundId) {
    const response = await apiHelper.fetchWithAuth(
      `${BASE_URL}/lost-founds/${lostFoundId}`
    );
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal mengambil detail laporan');
    }

    return data.lost_found || null;
  }

  async function postLostFound({ title, description, status }) {
    const response = await apiHelper.fetchWithAuth(`${BASE_URL}/lost-founds`, {
      method: 'POST',
      body: JSON.stringify({ title, description, status }),
    });
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal menambahkan laporan');
    }

    return { message, data };
  }

  async function putLostFound(
    lostFoundId,
    { title, description, status, is_completed }
  ) {
    const response = await apiHelper.fetchWithAuth(
      `${BASE_URL}/lost-founds/${lostFoundId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          title,
          description,
          status,
          is_completed: Number(is_completed),
        }),
      }
    );
    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal memperbarui laporan');
    }

    return message;
  }

  async function postLostFoundCover(lostFoundId, cover) {
    const formData = new FormData();
    formData.append('cover', cover);

    const response = await apiHelper.fetchWithAuth(
      `${BASE_URL}/lost-founds/${lostFoundId}/cover`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal mengunggah cover laporan');
    }

    return message;
  }

  async function deleteLostFound(lostFoundId) {
    const response = await apiHelper.fetchWithAuth(
      `${BASE_URL}/lost-founds/${lostFoundId}`,
      {
        method: 'DELETE',
      }
    );
    const responseJson = await response.json();
    const { success, message } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal menghapus laporan');
    }

    return message;
  }

  async function getStatsDaily(params = {}) {
    const query = new URLSearchParams();
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.total_data) query.append('total_data', params.total_data);

    const queryString = query.toString();
    const url = `${BASE_URL}/lost-founds/stats/daily${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await apiHelper.fetchWithAuth(url);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal mengambil statistik harian');
    }

    return data;
  }

  async function getStatsMonthly(params = {}) {
    const query = new URLSearchParams();
    if (params.end_date) query.append('end_date', params.end_date);
    if (params.total_data) query.append('total_data', params.total_data);

    const queryString = query.toString();
    const url = `${BASE_URL}/lost-founds/stats/monthly${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await apiHelper.fetchWithAuth(url);
    const responseJson = await response.json();
    const { success, message, data } = responseJson;

    if (!success) {
      throw new Error(message || 'Gagal mengambil statistik bulanan');
    }

    return data;
  }

  return {
    getLostFounds,
    getLostFoundById,
    postLostFound,
    putLostFound,
    postLostFoundCover,
    deleteLostFound,
    getStatsDaily,
    getStatsMonthly,
  };
})();

export default lostFoundApi;