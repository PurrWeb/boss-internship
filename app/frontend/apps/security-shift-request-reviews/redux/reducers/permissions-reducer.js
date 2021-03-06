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
    [types.UPDATE_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const permissions = oFetch(action, 'payload.permissions');
      const securityShiftRequest = oFetch(action, 'payload.securityShiftRequest');
      const id = oFetch(securityShiftRequest, 'id');

      return state.setIn(['shiftRequests', id.toString()], Immutable.fromJS(permissions));
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
