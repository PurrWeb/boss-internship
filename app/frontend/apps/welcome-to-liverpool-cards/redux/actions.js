import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';
import { enableCardRequest, disableCardRequest, getWtlCardsDataRequest } from '../requests';
import { getWtlCardsFilterQueryParams } from '../selectors';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const loadWtlCardsData = createAction(types.LOAD_WTL_CARDS_DATA);
export const setWtlCardsData = createAction(types.SET_WTL_CARDS_DATA);
export const changeActiveFilter = createAction(types.CHANGE_ACTIVE_FILTER);
export const changeCardNumberFilter = createAction(types.CHANGE_CARD_NUMBER_FILTER);
export const enableCard = createAction(types.ENABLE_CARD);
export const disableCard = createAction(types.DISABLE_CARD);
export const incrementPage = createAction(types.INCREMENT_PAGE);

export const getWtlCardsData = params => (dispatch, getState) => {
  const pageNumber = getState().getIn(['pagination', 'pageNumber']);
  return getWtlCardsDataRequest({ ...params, page: pageNumber }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(setWtlCardsData(data));
  });
};

export const appendWtlCardsData = params => (dispatch, getState) => {
  const pageNumber = getState().getIn(['pagination', 'pageNumber']);
  return getWtlCardsDataRequest({ ...params, page: pageNumber }).then(response => {
    const data = oFetch(response, 'data');
    dispatch(loadWtlCardsData(data));
  });
};

export const loadMore = () => dispatch => {
  dispatch(incrementPage());
  const filter = getWtlCardsFilterQueryParams();
  return dispatch(appendWtlCardsData(filter));
};
export const enadleCardRequested = params => dispatch => {
  return enableCardRequest(params).then(response => dispatch(enableCard(response.data)));
};

export const disableCardRequested = params => dispatch => {
  return disableCardRequest(params).then(response => dispatch(disableCard(response.data)));
};
