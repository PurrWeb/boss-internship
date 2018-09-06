import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';

import * as constants from './constants';

import {
  loadDataRequest,
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

const checkRequestsCountEmpty = accessoryId => (dispatch, getState) => {
  const requestsCount = getState()
    .getIn(['accessoryRequestsPage', 'accessoryRequests'])
    .filter(item => item.get('accessoryId') === accessoryId).size;
  const requestsRefundsCount = getState()
    .getIn(['accessoryRequestsPage', 'accessoryRefundRequests'])
    .filter(item => item.get('accessoryId') === accessoryId).size;

  return requestsCount === 0 && requestsRefundsCount === 0;
};

export const changeVenue = venueId => (dispatch, getState) => {
  const queryString = new URLSearchParams(window.location.search);
  queryString.set('venue_id', venueId);
  window.history.pushState('state', 'title', `accessory-requests?${queryString}`);
  dispatch([setVenue(venueId), dropPageNumber()]);
  return dispatch(loadData()).then(resp => {
    return dispatch(loadInitialAccessoryRequests(resp.data));
  });
};

export const loadInitialData = () => (dispatch, getState) => {
  return dispatch(loadData()).then(resp => {
    return dispatch(loadInitialAccessoryRequests(resp.data));
  });
};

export const loadData = () => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  const currentPage = parseInt(getState().getIn(['accessoryRequestsPage', 'pagination', 'pageNumber']));

  return loadDataRequest({
    venueId: currentVenue,
    currentPage: currentPage,
  });
};

export const updatePages = () => (dispatch, getState) => {
  return dispatch(loadData()).then(loadDataResponse => {
    const { accessories } = loadDataResponse.data;
    if (accessories.length === 0) return;
    const lastAccessory = accessories[accessories.length - 1];
    const data = {
      ...loadDataResponse.data,
      accessories: [lastAccessory],
    };
    dispatch(loadInitialAccessoryRequests(data));
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
  }).then(completeResponse => {
    dispatch(removeRequestFromStore(completeResponse.data));
    if (dispatch(checkRequestsCountEmpty(accessoryId))) {
      dispatch(removeAccessoryFromStore(accessoryId));
      dispatch(updatePages());
    }
    return completeResponse;
  });
};

export const completeAccessoryRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return completeAccessoryRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(completeResponse => {
    dispatch(removeRequestFromStore(completeResponse.data));
    if (dispatch(checkRequestsCountEmpty(accessoryId))) {
      dispatch(removeAccessoryFromStore(accessoryId));
      dispatch(updatePages());
    }
  });
};

export const acceptAccessoryRefundRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
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

export const rejectAccessoryRefundRequest = ({ requestId, accessoryId }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return rejectAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
  }).then(completeResponse => {
    dispatch(removeRefundRequestFromStore(completeResponse.data));
    if (dispatch(checkRequestsCountEmpty(accessoryId))) {
      dispatch(removeAccessoryFromStore(accessoryId));
      dispatch(updatePages());
    }
    return completeResponse;
  });
};

export const completeAccessoryRefundRequest = ({ requestId, accessoryId, reusable }) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['accessoryRequestsPage', 'currentVenue']);

  return completeAccessoryRefundRequestRequest({
    venueId: currentVenue,
    accessoryId,
    requestId,
    reusable,
  }).then(completeResponse => {
    dispatch(removeRefundRequestFromStore(completeResponse.data));
    if (dispatch(checkRequestsCountEmpty(accessoryId))) {
      dispatch(removeAccessoryFromStore(accessoryId));
      dispatch(updatePages());
    }
    return completeResponse;
  });
};

export const loadMoreClick = () => (dispatch, getState) => {
  dispatch(loadMore());
  return dispatch(loadData()).then(resp => {
    return dispatch(loadInitialAccessoryRequests(resp.data));
  });
};
