import { createAction } from 'redux-actions';
import * as types from './types';
import { enableCardRequest, disableCardRequest } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changeActiveFilter = createAction(types.CHANGE_ACTIVE_FILTER);
export const changeCardNumberFilter = createAction(types.CHANGE_CARD_NUMBER_FILTER);
export const enableCard = createAction(types.ENABLE_CARD);
export const disableCard = createAction(types.DISABLE_CARD);

export const enadleCardRequested = params => dispatch => {
  return enableCardRequest(params).then(response => dispatch(enableCard(response.data)));
};

export const disableCardRequested = params => dispatch => {
  return disableCardRequest(params).then(response => dispatch(disableCard(response.data)));
};
