import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';
import {
  enableClientRequest,
  disableClientRequest,
  updateClientProfileRequest,
  getWtlClientsRequest,
} from '../requests';
import { getWtlClientsFilterQueryParams } from '../selectors';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const loadWtlClients = createAction(types.LOAD_WTL_CLIENTS);
export const changeFilter = createAction(types.CHANGE_FILTER);

export const enableClient = createAction(types.ENABLE_CLIENT);
export const disableClient = createAction(types.DISABLE_CLIENT);
export const updateClientProfile = createAction(types.UPDATE_CLIENT_PROFILE);
export const incrementPage = createAction(types.INCREMENT_PAGE);

export const getWtlClients = params => (dispatch, getState) => {
  const pageNumber = getState().getIn(['pagination', 'pageNumber']);
  return getWtlClientsRequest({ ...params, page: pageNumber }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(loadWtlClients(data));
  });
};

export const loadMore = () => dispatch => {
  dispatch(incrementPage());
  const filter = getWtlClientsFilterQueryParams();
  return dispatch(getWtlClients(filter));
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
