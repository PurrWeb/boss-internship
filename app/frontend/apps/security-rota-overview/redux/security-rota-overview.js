import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import * as types from './types';

const initialState = fromJS({});
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const {
        accessToken,
        staffMembers,
        venues,
        startDate,
        endDate,
      } = action.payload;
      return fromJS({ accessToken, staffMembers, venues, startDate, endDate });
    },
  },
  initialState,
);
