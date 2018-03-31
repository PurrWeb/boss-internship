import { createAction } from 'redux-actions';
import {
  INITIAL_PAGE_LOAD
} from './constants';
import oFetch from 'o-fetch';

export const initialPageLoad = (params) => (dispatch, getState) => {
  const accessToken = oFetch(params, 'accessToken');
  const payments = oFetch(params, 'payments');

  dispatch(loadInitialState({
    accessToken: accessToken,
    payments: payments
  }));
}

export const loadInitialState = createAction(INITIAL_PAGE_LOAD);
