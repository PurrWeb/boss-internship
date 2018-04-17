import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from './types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const shiftRequests = oFetch(action, 'payload.securityShiftRequests')
      return Immutable.fromJS(shiftRequests);
    },
    [types.REJECT_SECURITY_SHIFT_REQUEST]: (state, action) => {
      const id = oFetch(action, 'payload.id');

      const shiftRequestIndex = state.findIndex(
        securityShiftRequest => securityShiftRequest.get('id') === id,
      );

      return state.delete(shiftRequestIndex);
    },
  },
  initialState,
);