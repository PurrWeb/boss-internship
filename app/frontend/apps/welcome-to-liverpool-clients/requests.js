import oFetch from 'o-fetch';
import http from '~/lib/request-api';

export const disableClientRequest = params => {
  const id = oFetch(params, 'id');
  return http().post(`/api/v1/wtl_clients/${id}/disable`);
};

export const enableClientRequest = params => {
  const id = oFetch(params, 'id');
  return http().post(`/api/v1/wtl_clients/${id}/enable`);
};

export const fetchClientHistory = params => {
  const id = oFetch(params, 'id');
  return http().get(`/api/v1/wtl_clients/${id}/history`);
};
