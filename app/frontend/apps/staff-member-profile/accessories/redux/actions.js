import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';
import oFetch from 'o-fetch';

import * as constants from './constants';
import { newAccessoryRequest, cancelAccessoryRequest } from '../requests';
export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);
export const addAccessory = createAction(constants.ADD_ACCESSORY);

export const newAccessory = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const values = oFetch(params, 'values');
  return newAccessoryRequest(staffMemberId, {
    size: oFetch(values, 'size'),
    accessoryId: oFetch(values, 'accessoryId'),
  }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(addAccessory(data));
    return response;
  });
};

export const cancelAccessory = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const accessoryId = oFetch(params, 'accessoryId');
  return cancelAccessoryRequest(staffMemberId, accessoryId).then(response => {
    console.log(response.data);
  });
};

export const refundAccessory = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const accessoryId = oFetch(params, 'accessoryId');
  return refundAccessoryRequest(staffMemberId, accessoryId).then(response => {
    console.log(response.data);
  });
};
