import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = Immutable.fromJS({
  nameFilter: null,
  emailFilter: null,
  statusFilter: null,
  cardNumberFilter: null,
});

export default handleActions(
  {
    [types.CHANGE_FILTER]: (state, action) => {
      const nameFilter = oFetch(action, 'payload.name');
      const emailFilter = oFetch(action, 'payload.email');
      const statusFilter = oFetch(action, 'payload.status');
      const cardNumberFilter = oFetch(action, 'payload.cardNumber');
      return state
        .set('nameFilter', nameFilter)
        .set('emailFilter', emailFilter)
        .set('statusFilter', statusFilter)
        .set('cardNumberFilter', cardNumberFilter);
    },
  },
  initialState,
);
