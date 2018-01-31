import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';

import * as constants from './constants';

import {
  loadInitialDataRequest,
  acceptAccessoryRequestRequest,
  rejectAccessoryRequestRequest,
  acceptAccessoryRefundRequestRequest,
  rejectAccessoryRefundRequestRequest,
} from '../requests';

export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);
export const loadInitialAccessoryRequests = createAction(
  constants.LOAD_INITIAL_ACCESSORY_REQUESTS,
);
export const setVenue = createAction(constants.SET_VENUE);
export const dropPageNumber = createAction(constants.DROP_PAGE_NUMBER);
export const loadMore = createAction(constants.LOAD_MORE);
export const updateRequestInStore = createAction(constants.UPDATE_REQUEST);
export const updateRefundRequestInStore = createAction(
  constants.UPDATE_REFUND_REQUEST,
);

export const changeVenue = venueId => (dispatch, getState) => {
  const queryString = new URLSearchParams(window.location.search);
  queryString.set('venue_id', venueId);
  window.history.pushState(
    'state',
    'title',
    `accessory-requests?${queryString}`,
  );
  dispatch([setVenue(venueId), dropPageNumber()]);
  dispatch(loadInitialData());
};

export const loadInitialData = () => (dispatch, getState) => {
  const currentVenue = getState().getIn([
    'accessoryRequestsPage',
    'currentVenue',
  ]);

  const currentPage = parseInt(
    getState().getIn(['accessoryRequestsPage', 'pagination', 'pageNumber']),
  );

  return loadInitialDataRequest({
    venueId: currentVenue,
    currentPage: currentPage,
  }).then(resp => {
    dispatch(loadInitialAccessoryRequests(resp.data));
    return resp;
  });
};

export const acceptAccessoryRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn([
    'accessoryRequestsPage',
    'currentVenue',
  ]);

  return acceptAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(updateRequestInStore(resp.data));
    return resp;
  });
};

export const rejectAccessoryRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn([
    'accessoryRequestsPage',
    'currentVenue',
  ]);

  return rejectAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(updateRequestInStore(resp.data));
    return resp;
  });
};

export const acceptAccessoryRefundRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn([
    'accessoryRequestsPage',
    'currentVenue',
  ]);

  return acceptAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(updateRefundRequestInStore(resp.data));
    return resp;
  });
};

export const rejectAccessoryRefundRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn([
    'accessoryRequestsPage',
    'currentVenue',
  ]);

  return rejectAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(updateRefundRequestInStore(resp.data));
    return resp;
  });
};

export const loadMoreClick = () => (dispatch, getState) => {
  dispatch(loadMore());
  dispatch(loadInitialData());
};
