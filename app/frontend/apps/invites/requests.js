import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const inviteUserRequest = params => {
  throw new Error('Not implemented inviteUserRequest Route');
  return http().post(`/api/v1/slug/`, params);
};

export const revokeInviteRequest = params => {
  const inviteId = oFetch(params, 'inviteId');
  throw new Error('Not implemented revokeInviteRequest Route');
  return http().post(`/api/v1/slug/${inviteId}`, params);
};
