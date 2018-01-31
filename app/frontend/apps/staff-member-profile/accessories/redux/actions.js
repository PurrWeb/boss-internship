import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';
import oFetch from 'o-fetch';

import * as constants from './constants';
import {
  newAccessoryRequest,
} from '../requests';
export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);

export const newAccessory = (params) => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const values = oFetch(params, 'values');
  return newAccessoryRequest(staffMemberId, {
    size: oFetch(values, 'size'),
    accessoryId: oFetch(values, 'accessoryId')
  });
}
