/**
 * Delcom Open API membalas dengan format:
 *   { status: 'success' | 'fail', message: string, data?: any }
 * Saat validasi gagal, `data` berisi detail per field, misalnya:
 *   { email: ['The email has already been taken.'] }
 */
function isSuccessResponse(responseJson) {
  return responseJson.success === true || responseJson.status === 'success';
}

function getErrorMessage(responseJson, fallbackMessage) {
  const baseMessage = responseJson.message || fallbackMessage;
  const { data } = responseJson;
  const details = data && typeof data === 'object'
    ? Object.values(data).flat().filter((item) => typeof item === 'string')
    : [];

  return details.length > 0 ? `${baseMessage}: ${details.join(' ')}` : baseMessage;
}

function parseApiResponse(responseJson, fallbackMessage) {
  if (!isSuccessResponse(responseJson)) {
    throw new Error(getErrorMessage(responseJson, fallbackMessage));
  }
  return responseJson;
}

export { isSuccessResponse, getErrorMessage, parseApiResponse };
