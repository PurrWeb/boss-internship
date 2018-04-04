import axios from 'axios';
import oFetch from 'o-fetch';

export function http() {
  const instance = axios.create();
  instance.defaults.headers.common['Authorization'] = `Token token="${
    window.boss.accessToken
  }"`;

  return instance;
}

export function getSecurityRotaDayData(options) {
  const date = oFetch(options, 'date');
  return http().get(`/api/v1/security_rota_overview/${date}`);
}
