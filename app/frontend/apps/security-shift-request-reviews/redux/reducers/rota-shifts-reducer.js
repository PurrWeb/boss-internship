import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const securityShiftRequests = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const rotaShifts = oFetch(action, 'payload.rotaShifts');

      return Immutable.fromJS(rotaShifts);
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
