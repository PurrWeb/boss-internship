import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.Map();

const securityShiftRequests = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const shiftRequests = oFetch(action, 'payload.permissions.shiftRequests');
      return Immutable.fromJS({ shiftRequests });
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
