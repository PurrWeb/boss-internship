import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.Map();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const payload = oFetch(action, 'payload');

      const permissions = oFetch(payload, 'permissions');
      const startDate = oFetch(payload, 'startDate');
      const endDate = oFetch(payload, 'endDate');
      const date = oFetch(payload, 'date');
      const venue = oFetch(payload, 'venue');
      const venueId = oFetch(venue, 'id');
      const payRateFilter = 'all';
      return Immutable.fromJS({ date, startDate, endDate, venueId, payRateFilter, permissions });
    },
    [types.CHANGE_PAY_RATE_FILTER]: (state, action) => {
      const payRateFilter = oFetch(action, 'payload.filter');
      return state.set('payRateFilter', payRateFilter);
    },
  },
  initialState,
);
