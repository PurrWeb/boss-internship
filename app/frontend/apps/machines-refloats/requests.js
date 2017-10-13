import axios from 'axios';

const http = axios.create();

export const createMachinesRefloatRequest = ({values, venueId}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  return http.post(`/api/v1/machines_refloats`, {
    venueId,
    ...values,
  });
};
