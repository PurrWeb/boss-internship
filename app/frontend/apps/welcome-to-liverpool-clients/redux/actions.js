import { createAction } from 'redux-actions';
import * as types from './types';
import { enableClientRequest, disableClientRequest, updateClientProfileRequest } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changeFilter = createAction(types.CHANGE_FILTER);

export const enableClient = createAction(types.ENABLE_CLIENT);
export const disableClient = createAction(types.DISABLE_CLIENT);
export const updateClientProfile = createAction(types.UPDATE_CLIENT_PROFILE);

export const enableClientRequested = params => dispatch => {
  return enableClientRequest(params).then(response => dispatch(enableClient(response.data)));
};

export const disableClientRequested = params => dispatch => {
  return disableClientRequest(params).then(response => dispatch(disableClient(response.data)));
};

export const updateClientProfileRequested = params => dispatch => {
  return updateClientProfileRequest(params).then(response => dispatch(updateClientProfile(response.data)));
};
