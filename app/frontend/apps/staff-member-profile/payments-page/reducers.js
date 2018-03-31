import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import {
  INITIAL_PAGE_LOAD
} from './constants';

const initialGlobalState = fromJS({
  accessToken: null,
  payments: []
})

export const globalReducer = handleActions({
  [INITIAL_PAGE_LOAD]: (state, action) => {
    const payload = oFetch(action, 'payload');
    const accessToken = oFetch(payload, 'accessToken');
    const payments = oFetch(payload, 'payments');

    return state.
      set('accessToken', accessToken).
      set('payments', payments);
  }
}, initialGlobalState);
