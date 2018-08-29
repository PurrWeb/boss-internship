import oFetch from 'o-fetch';
import http from '~/lib/request-api';

export const disableCardRequest = params => {
  const number = oFetch(params, 'number');
  return http().post(`/api/wtl/v1/cards/${number}/disable`);
};

export const enableCardRequest = params => {
  const number = oFetch(params, 'number');

  return http().post(`/api/wtl/v1/cards/${number}/enable`);
};
