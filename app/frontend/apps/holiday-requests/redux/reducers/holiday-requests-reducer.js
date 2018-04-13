import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const holidayRequestsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const payload = oFetch(action, 'payload');
      return Immutable.fromJS(oFetch(payload, 'holidayRequests'));
    },
    [types.REMOVE_HOLIDAY_REQUEST]: (state, action) => {
      const holidayRequestId = oFetch(action, 'payload');

      return state.filter(holidayRequest => holidayRequest.get('id') !== holidayRequestId);
    },
  },
  initialGlobalState,
);

export default holidayRequestsReducer;
