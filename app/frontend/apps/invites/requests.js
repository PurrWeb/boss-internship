import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const inviteUserRequest = params => {
  return http().post(`/api/v1/invites/`, params);
};

export const revokeInviteRequest = params => {
  const inviteId = oFetch(params, 'inviteId');
  return http().post(`/api/v1/invites/${inviteId}/revoke`, params);
};
