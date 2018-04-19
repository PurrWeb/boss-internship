import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const securityShiftRequests = handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const weekRotaShifts = oFetch(action, 'payload.weekRotaShifts');

      return Immutable.fromJS(weekRotaShifts);
    },
    [types.ADD_ROTA_SHIFT]: (state, action) => {
      const rotaShift = oFetch(action, 'payload.rotaShift');

      return state.push(Immutable.fromJS(rotaShift));
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
