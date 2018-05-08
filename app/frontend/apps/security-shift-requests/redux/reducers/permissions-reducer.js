import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const staffMembersReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const permissions = oFetch(action, 'payload.permissions');

      return Immutable.fromJS(permissions);
    },
    [types.UPDATE_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const permissions = oFetch(action, 'payload.permissions');
      const securityShiftRequest = oFetch(action, 'payload.securityShiftRequest');
      const id = oFetch(securityShiftRequest, 'id');

      return state.setIn(['shiftRequests', id.toString()], Immutable.fromJS(permissions));
    },
    [types.ADD_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const permissions = oFetch(action, 'payload.permissions');
      const securityShiftRequest = oFetch(action, 'payload.securityShiftRequest');
      const id = oFetch(securityShiftRequest, 'id');

      return state.setIn(['shiftRequests', id.toString()], Immutable.fromJS(permissions));
    }
  },
  initialGlobalState,
);

export default staffMembersReducer;
