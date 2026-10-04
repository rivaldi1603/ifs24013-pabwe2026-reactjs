const ACCESS_TOKEN_KEY = 'accessToken';

function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

const apiHelper = {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  fetchWithAuth,
};

export {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  fetchWithAuth,
};
export default apiHelper;