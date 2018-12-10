import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import { PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE } from '../../constants';

import * as types from '../types';

const initialState = Immutable.Map();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const startDate = oFetch(action, 'payload.startDate');
      const endDate = oFetch(action, 'payload.endDate');
      const date = oFetch(action, 'payload.date');
      const venueId = oFetch(action, 'payload.venue.id');
      const filterType = PAYROLL_REPORT_SHOW_ALL_FILTER_TYPE;
      return Immutable.fromJS({ date, startDate, endDate, venueId, filterType });
    },
    [types.CHANGE_PAY_RATE_FILTER]: (state, action) => {
      const filterType = oFetch(action, 'payload.filter');
      return state.set('filterType', filterType);
    },
  },
  initialState,
);