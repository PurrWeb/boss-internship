import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { clockInBreaks } = action.payload;
      return fromJS(clockInBreaks);
    },
    [types.DONE_PERIOD]: (state, action) => {
      const periods = oFetch(action.payload, 'periods');
      const clockInPeriods = oFetch(
        periods,
        'clockInPeriods',
      );
      const clockInPeriodsIds = clockInPeriods.map(period => oFetch(period, 'id'));
      return state.filter(shift => !clockInPeriodsIds.includes(shift.get('clockInPeriod')));
    },
  },
  initialState,
);
