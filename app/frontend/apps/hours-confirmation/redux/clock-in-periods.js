import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { clockInPeriods } = action.payload;
      return fromJS(clockInPeriods);
    },
    [types.FORCE_CLOCK_OUT]: (state, action) => {
      const newClockInPeriod = oFetch(action.payload, 'clockInPeriod');
      const clockInPeriodId = oFetch(newClockInPeriod, 'id');
      return state.update(
        state.findIndex(
          clockInPeriod => clockInPeriod.get('id') === clockInPeriodId,
        ),
        clockInPeriod => clockInPeriod.merge(fromJS(newClockInPeriod)),
      );
    },
  },
  initialState,
);
