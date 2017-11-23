import axios from 'axios';
const accessToken = window.boss.store.accessToken;
const http = axios.create();

const setupAccessToken = (accessToken) => {
  http.defaults.headers.common['Authorization'] = `Token token="${accessToken}"`;
}

export const sendPasswordSetupEmailRequest = (staffMember) => {
  setupAccessToken(window.boss.store.accessToken);
  return axios.post(`/api/v1/staff_members/${staffMember.id}/send_verification`);
}

export const resendPasswordSetupEmailRequest = (staffMember) => {
  setupAccessToken(window.boss.store.accessToken);
  return axios.post(`/api/v1/staff_members/${staffMember.id}/resend_verification`);
}

export const revokePasswordSetupEmailRequest = (staffMember) => {
  setupAccessToken(window.boss.store.accessToken);
  return axios.post(`/api/v1/staff_members/${staffMember.id}/resend_verification`);
}
