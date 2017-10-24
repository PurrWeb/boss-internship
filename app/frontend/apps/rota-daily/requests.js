import axios from 'axios';

const http = axios.create();

export const updateStaffMemberShiftRequest = (values) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  const {
    shift_id,
  } = values;
  return http.patch(`/api/v1/rota_shifts/${shift_id}`, {
    ...values,
  });
};

export const deleteStaffMemberShiftRequest = (shift_id) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  
  return http.delete(`/api/v1/rota_shifts/${shift_id}`);
};

export const addShiftRequest = (values, venueId, rotaDate) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  
  return http.post(`/api/v1/venues/${venueId}/rotas/${rotaDate}/rota_shifts`, {
    ...values,
  });
};

export const setRotaStatusRequest = (status, venueId, rotaDate) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  if (!['in_progress', 'finished'].includes(status)) {
    throw Error('Wrong status');
  }
  return http.post(`/api/v1/venues/${venueId}/rotas/${rotaDate}/mark_${status}`);
};
