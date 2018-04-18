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
      const id = oFetch(action, 'payload.id');
      const note = oFetch(action, 'payload.note');
      const venueId = oFetch(action, 'payload.venueId');
      const startsAt = oFetch(action, 'payload.startsAt');
      const endsAt = oFetch(action, 'payload.endsAt');
      const createdShiftId = oFetch(action, 'payload.createdShiftId');
      const status = oFetch(action, 'payload.status');

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
  },
  initialGlobalState,
);

export default securityShiftRequests;
