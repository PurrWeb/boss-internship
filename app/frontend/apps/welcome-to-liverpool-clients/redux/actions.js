import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';
import {
  enableClientRequest,
  disableClientRequest,
  updateClientProfileRequest,
  getWtlClientsRequest,
  getWtlClientRequest,
  resendWtlClientVerificationEmailRequest,
} from '../requests';

import { getWtlClientsFilterQueryParams } from '../selectors';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const loadWtlClients = createAction(types.LOAD_WTL_CLIENTS);
export const loadWtlClient = createAction(types.LOAD_WTL_CLIENT);
export const setWtlClients = createAction(types.SET_WTL_CLIENTS);
export const changeFilter = createAction(types.CHANGE_FILTER);

export const enableClient = createAction(types.ENABLE_CLIENT);
export const disableClient = createAction(types.DISABLE_CLIENT);
export const updateClientProfile = createAction(types.UPDATE_CLIENT_PROFILE);
export const incrementPage = createAction(types.INCREMENT_PAGE);

export const getWtlClients = params => (dispatch, getState) => {
  const pageNumber = getState().getIn(['pagination', 'pageNumber']);
  return getWtlClientsRequest({ ...params, page: pageNumber }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(setWtlClients(data));
  });
};

export const getWtlClient = params => (dispatch, getState) => {
  return getWtlClientRequest(params).then(response => {
    const data = oFetch(response, 'data');
    dispatch(loadWtlClient(data));
    return data;
  });
};

export const appendWtlClients = params => (dispatch, getState) => {
  const pageNumber = getState().getIn(['pagination', 'pageNumber']);
  return getWtlClientsRequest({ ...params, page: pageNumber }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(loadWtlClients(data));
  });
};

export const filterWtlClients = params => (dispatch, getState) => {
  return getWtlClientsRequest({ ...params, page: 1 }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(setWtlClients(data));
  });
};

export const loadMore = filter => dispatch => {
  dispatch(incrementPage());
  return dispatch(appendWtlClients(filter));
};

export const enableClientRequested = params => dispatch => {
  return enableClientRequest(params).then(response => dispatch(enableClient(response.data)));
};

export const disableClientRequested = params => dispatch => {
  return disableClientRequest(params).then(response => dispatch(disableClient(response.data)));
};

export const updateClientProfileRequested = params => dispatch => {
  return updateClientProfileRequest(params).then(response => dispatch(updateClientProfile(response.data)));
};

export const resendWtlClientVerificationEmailAction = params => dispatch => {
  return resendWtlClientVerificationEmailRequest(params).then(response => dispatch(updateClientProfile(response.data)));
};
