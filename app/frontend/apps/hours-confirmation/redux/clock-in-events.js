import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { clockInEvents } = action.payload;
      return fromJS(clockInEvents);
    },
    [types.FORCE_CLOCK_OUT]: (state, action) => {
      const { clockInEvent } = action.payload;
      return state.update(clockInEvents =>
        clockInEvents.push(fromJS(clockInEvent)),
      );
    },
  },
  initialState,
);
