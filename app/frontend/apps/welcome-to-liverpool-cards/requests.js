import oFetch from 'o-fetch';
import http from '~/lib/request-api';

export const getWtlCardsDataRequest = params => {
  return http().get(`/api/v1/wtl_cards`, {
    params,
  });
};

export const disableCardRequest = params => {
  const number = oFetch(params, 'number');
  return http().post(`/api/v1/wtl_cards/${number}/disable`);
};

export const enableCardRequest = params => {
  const number = oFetch(params, 'number');

  return http().post(`/api/v1/wtl_cards/${number}/enable`);
};

export const fetchWtlCardHistoryRequest = params => {
  const number = oFetch(params, 'number');
  return http({ showNotification: false }).get(`/api/v1/wtl_cards/${number}/history`);
};
