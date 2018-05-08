import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.Map();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const startDate = oFetch(action, 'payload.startDate');
      const endDate = oFetch(action, 'payload.endDate');
      const date = oFetch(action, 'payload.date');
      const venueId = oFetch(action, 'payload.venue.id');
      const payRateFilter = 'all';
      return Immutable.fromJS({ date, startDate, endDate, venueId, payRateFilter });
    },
    [types.CHANGE_PAY_RATE_FILTER]: (state, action) => {
      const payRateFilter = oFetch(action, 'payload.filter');
      return state.set('payRateFilter', payRateFilter);
    },
  },
  initialState,
);