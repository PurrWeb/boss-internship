import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const securityShiftRequests = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const securityShiftRequests = oFetch(action, 'payload.securityShiftRequests');

      return Immutable.fromJS(securityShiftRequests);
    },
    [types.ADD_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const newShiftRequest = oFetch(action, 'payload');

      return state.push(Immutable.fromJS(newShiftRequest));
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
