/* global DELCOM_BASEURL */
const DEFAULT_BASE_URL = 'https://open-api.delcom.org/api/v1';

function getBaseUrl() {
  return typeof DELCOM_BASEURL !== 'undefined' ? DELCOM_BASEURL : DEFAULT_BASE_URL;
}

export { DEFAULT_BASE_URL, getBaseUrl };
export default getBaseUrl;
