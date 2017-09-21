import axios from 'axios';

const http = axios.create();

export const createMachineRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  const {
    formatedValues,
    venueId,
  } = requestData;
  return http.post(`/api/v1/machines`, {
    ...formatedValues,
    venueId
  });
}

export const updateMachineRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  const {
    values,
    venueId,
  } = requestData;
  return http.put(`/api/v1/machines/${values.id}`, {
    ...values,
    venueId
  });
}

export const disableMachineRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  const {
    machineId,
    venueId,
  } = requestData;
  return http.delete(`/api/v1/machines/${machineId}`, {
    params: {
      venueId,
    }
  });
}

export const restoreMachineRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;
  const {
    values,
    venueId,
  } = requestData;
  return http.post(`/api/v1/machines/${values.id}/restore`, {
    ...values,
    venueId,
  });
}
