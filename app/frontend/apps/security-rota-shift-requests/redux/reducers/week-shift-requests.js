import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const weekShiftRequests = oFetch(action, 'payload.weekShiftRequests')
      return Immutable.fromJS(weekShiftRequests);
    },
    [types.REMOVE_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const id = oFetch(action, 'payload.id');

      const shiftRequestIndex = state.findIndex(
        securityShiftRequest => securityShiftRequest.get('id') === id,
      );

      return state.delete(shiftRequestIndex);
    },
  },
  initialState,
);