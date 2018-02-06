import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';

import * as constants from './constants';

import {
  loadInitialDataRequest,
  acceptAccessoryRequestRequest,
  rejectAccessoryRequestRequest,
  acceptAccessoryRefundRequestRequest,
  rejectAccessoryRefundRequestRequest,
  undoAccessoryRequestRequest,
  undoAccessoryRefundRequestRequest,
  completeAccessoryRequestRequest,
  completeAccessoryRefundRequestRequest,
} from '../requests';

export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);
export const loadInitialAccessoryRequests = createAction(constants.LOAD_INITIAL_ACCESSORY_REQUESTS);
export const setVenue = createAction(constants.SET_VENUE);
export const dropPageNumber = createAction(constants.DROP_PAGE_NUMBER);
export const loadMore = createAction(constants.LOAD_MORE);
export const updateRequestInStore = createAction(constants.UPDATE_REQUEST);
export const removeRequestFromStore = createAction(constants.REMOVE_REQUEST);
export const updateRefundRequestInStore = createAction(constants.UPDATE_REFUND_REQUEST);
export const removeRefundRequestFromStore = createAction(constants.REMOVE_REFUND_REQUEST);
export const removeAccessoryFromStore = createAction(constants.REMOVE_ACCESSORY);

const checkRequestsCountAndRemoveAccessory = accessoryId => (dispatch, getState) => {
  const requestsCount = getState()
    .getIn(['accessoryRequestsPage', 'accessoryRequests'])
    .filter(item => item.get('accessoryId') === accessoryId).size;
  const requestsRefundsCount = getState()
    .getIn(['accessoryRequestsPage', 'accessoryRefundRequests'])
    .filter(item => item.get('accessoryId') === accessoryId).size;

  if (requestsCount === 0 && requestsRefundsCount === 0) {
    dispatch(removeAccessoryFromStore(accessoryId));
  }
};

export const changeVenue = venueId => (dispatch, getState) => {
  const queryString = new URLSearchParams(window.location.search);
  queryString.set('venue_id', venueId);
  window.history.pushState('state', 'title', `accessory-requests?${queryString}`);
  dispatch([setVenue(venueId), dropPageNumber()]);
  dispatch(loadInitialData());
};

export const loadInitialData = () => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

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

export const acceptAccessoryRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return acceptAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  });
};

export const undoAccessoryRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return undoAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  });
};

export const rejectAccessoryRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return rejectAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(removeRequestFromStore(resp.data));
    dispatch(checkRequestsCountAndRemoveAccessory(accessoryId));
    return resp;
  });
};
export const completeAccessoryRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return completeAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(removeRequestFromStore(resp.data));
    dispatch(checkRequestsCountAndRemoveAccessory(accessoryId));
    return resp;
  });
};

export const acceptAccessoryRefundRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return acceptAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  });
};

export const undoAccessoryRefundRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return undoAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  });
};

export const rejectAccessoryRefundRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return rejectAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(removeRefundRequestFromStore(resp.data));
    dispatch(checkRequestsCountAndRemoveAccessory(accessoryId));
    return resp;
  });
};

export const completeAccessoryRefundRequest = ({ requestId, accessoryId }) => (
  dispatch,
  getState,
) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return completeAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(resp => {
    dispatch(removeRefundRequestFromStore(resp.data));
    dispatch(checkRequestsCountAndRemoveAccessory(accessoryId));
    return resp;
  });
};

export const loadMoreClick = () => (dispatch, getState) => {
  dispatch(loadMore());
  dispatch(loadInitialData());
};
