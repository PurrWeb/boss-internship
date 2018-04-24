import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const securityShiftRequests = handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const weekRotas = oFetch(action, 'payload.weekRotas');

      return Immutable.fromJS(weekRotas);
    },
    [types.ADD_ROTA]: (state, action) => {
      const rota = oFetch(action, 'payload.rota');
      return state.push(Immutable.fromJS(rota));
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
