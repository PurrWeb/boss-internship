import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';
import oFetch from 'o-fetch';

import * as constants from './constants';
import {
  newAccessoryRequest,
  cancelAccessoryRequest,
  refundAccessoryRequest,
} from '../requests';
export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);
export const addAccessory = createAction(constants.ADD_ACCESSORY);
export const updateAccessoryRequestInStore = createAction(
  constants.UPDATE_ACCESSORY_REQUEST,
);

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
  const accessoryRequestId = oFetch(params, 'accessoryRequestId');
  return cancelAccessoryRequest(staffMemberId, accessoryRequestId).then(
    response => {
      updateAccessoryRequestInStore(response.data);
    },
  );
};

export const refundAccessory = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const accessoryRequestId = oFetch(params, 'accessoryRequestId');
  return refundAccessoryRequest(staffMemberId, accessoryRequestId).then(
    response => {
      dispatch(updateAccessoryRequestInStore(response.data));
    },
  );
};
