import oFetch from 'o-fetch';
import http from '~/lib/request-api';
import utils from '~/lib/utils';

export const disableClientRequest = params => {
  const id = oFetch(params, 'id');
  return http().post(`/api/v1/wtl_clients/${id}/disable`);
};

export const enableClientRequest = params => {
  const id = oFetch(params, 'id');
  return http().post(`/api/v1/wtl_clients/${id}/enable`);
};

export const updateClientProfileRequest = params => {
  const id = oFetch(params, 'id');
  const mDateOfBirth = oFetch(params, 'dateOfBirth');
  const dateOfBirth = mDateOfBirth ? mDateOfBirth.format(utils.commonDateFormat) : null;
  return http().put(`/api/v1/wtl_clients/${id}`, { ...params, dateOfBirth });
};
