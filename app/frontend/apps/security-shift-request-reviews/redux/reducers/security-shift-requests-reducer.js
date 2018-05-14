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
    [types.UPDATE_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const updatedSecurityShiftRequest = oFetch(action, 'payload.securityShiftRequest');
      const id = oFetch(updatedSecurityShiftRequest, 'id');
      const note = oFetch(updatedSecurityShiftRequest, 'note');
      const venueId = oFetch(updatedSecurityShiftRequest, 'venueId');
      const startsAt = oFetch(updatedSecurityShiftRequest, 'startsAt');
      const endsAt = oFetch(updatedSecurityShiftRequest, 'endsAt');
      const createdShiftId = oFetch(updatedSecurityShiftRequest, 'createdShiftId');
      const status = oFetch(updatedSecurityShiftRequest, 'status');

      const shiftRequestIndex = state.findIndex(
        securityShiftRequest => securityShiftRequest.get('id') === id,
      );

      return state.update(shiftRequestIndex, shiftRequest =>
        shiftRequest
          .set('startsAt', startsAt)
          .set('endsAt', endsAt)
          .set('note', note)
          .set('createdShiftId', createdShiftId)
          .set('status', status)
      );
    },
    [types.REMOVE_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const securityShiftRequest = oFetch(action, 'payload.securityShiftRequest');
      const securityShiftRequestId = oFetch(securityShiftRequest, 'id');
      return state.filter(shiftRequest => shiftRequest.get('id') !== securityShiftRequestId);
    }
  },
  initialGlobalState,
);

export default securityShiftRequests;
