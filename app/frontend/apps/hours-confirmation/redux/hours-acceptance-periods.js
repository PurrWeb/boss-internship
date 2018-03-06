import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import * as types from './types';

const initialState = fromJS([]);
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { hoursAcceptancePeriods } = action.payload;
      return fromJS(hoursAcceptancePeriods);
    },
  },
  initialState,
);
