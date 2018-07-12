import { createAction } from 'redux-actions';
import URLSearchParams from 'url-search-params';

import * as constants from './constants';

import {
  loadInitialDataRequest,
  createAccessoryRequest,
  updateAccessoryRequest,
  disableAccessoryRequest,
  restoreAccessoryRequest,
  updateAccessoryFreeItemsRequest,
} from '../requests';

export const loadInitialState = createAction(constants.LOAD_INITIAL_STATE);
export const loadInitialAccessories = createAction(constants.LOAD_INITIAL_ACCESSORIES);
export const updateAccessoryInStore = createAction(constants.UPDATE_ACCESSORY);
export const addAccessoryToStore = createAction(constants.ADD_ACCESSORY);
export const loadMore = createAction(constants.LOAD_MORE);
export const removeLast = createAction(constants.REMOVE_LAST);
export const incrementTotal = createAction(constants.INCREMENT_TOTAL);
export const dropPageNumber = createAction(constants.DROP_PAGE_NUMBER);

export const filter = () => (dispatch, getState) => {
  dispatch(dropPageNumber());
  return dispatch(loadInitialData());
}

export const loadInitialData = () => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  const currentPage = parseInt(getState().getIn(['page', 'pagination', 'pageNumber']));
  const queryString = new URLSearchParams(window.location.search);
  queryString.delete('venue_id');
  const filter = [...queryString].reduce((summ, item) => {
    return {...summ, [item[0]]: item[1]}
  }, {});
  return loadInitialDataRequest({venueId: currentVenue, currentPage: currentPage, accessoriesFilter: {...filter}})
    .then(resp => {
      const { accessories, pagination } = resp.data;
      // HARDCODED, MUST BE REMOVED AFTER BACKEND INTEGRATION
      dispatch(loadInitialAccessories({ 
        accessories: accessories.map(accessory => ({ 
          ...accessory, 
          freeItemsCount: 12,
          bookedItemsCount: 1,
          refundsCount: 2,
          accessoryHistory: [
            {
              id: 1,
              count: 1,
              fullName: 'Jon Doe',
              time: '2018-04-11T15:18:03.000+01:00'
            },
            {
              id: 2,
              count: 20,
              fullName: 'Jon Doe',
              time: '2018-04-11T15:19:03.000+01:00'
            },
            {
              id: 3,
              count: -5,
              fullName: 'Jon Doe',
              time: '2018-04-11T15:20:03.000+01:00'
            },
          ]
        })),
        pagination 
      }));
      return resp;
    });
}

export const createAccessory = (values) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  const priceCents = (!values.priceCents || values.priceCents === 0) ? null : Math.round(values.priceCents * 100);
  const size = values.size.length === 0 ? null : values.size.map(size => size.name).join(',');
  return createAccessoryRequest({
    venueId: currentVenue,
    values: {...values, priceCents, size}
  }).then(resp => {
      // HARDCODED, MUST BE REMOVED AFTER BACKEND INTEGRATION

    dispatch(addAccessoryToStore({
      ...resp.data,
      freeItemsCount: 0,
      bookedItemsCount: 0,
      refundsCount: 0,
      accessoryHistory: [
       
      ],
    }));
    const size = getState().getIn(['page', 'accessories']).size;
    const pageNumber = getState().getIn(['page', 'pagination', 'pageNumber']);
    const perPage = getState().getIn(['page', 'pagination', 'perPage']);
    if (size > (pageNumber * perPage)) {
      dispatch(removeLast());
    }
    dispatch(incrementTotal());
    return resp;
  });
}

export const updateAccessory = (values) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  const priceCents = (!values.priceCents || values.priceCents === 0) ? null : Math.round(values.priceCents * 100);
  const size = values.size.length === 0 ? null : values.size.map(size => size.name).join(',');
  return updateAccessoryRequest({
    venueId: currentVenue,
    values: {...values, priceCents, size}
  }).then(resp => {
    dispatch(updateAccessoryInStore(resp.data));
    return resp;
  });
}

export const disableAccessory = (accessory) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  return disableAccessoryRequest({
    venueId: currentVenue,
    accessoryId: accessory.id,
  }).then(resp => {
    dispatch(updateAccessoryInStore(resp.data));
    return resp;
  });
}

export const restoreAccessory = (accessory) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  return restoreAccessoryRequest({
    venueId: currentVenue,
    accessoryId: accessory.id,
  }).then(resp => {
    dispatch(updateAccessoryInStore(resp.data));
    return resp;
  });
}

export const loadMoreClick = () => (dispatch, getState) => {
  dispatch(loadMore());
  dispatch(loadInitialData())
}

export const updateAccessoryFreeItems = (values) => (dispatch, getState) => {
  const currentVenue = getState().getIn(['page', 'pageData', 'currentVenue']);
  return updateAccessoryFreeItemsRequest({
    ...values,
    venueId: currentVenue,
  }).then(resp => {
    dispatch(updateAccessoryInStore(resp.data));
    return resp;
  });
}