import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const rotaShiftsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const rotaShifts = oFetch(action, 'payload.rotaShifts');
      const securityVenueShifts = oFetch(action, 'payload.securityVenueShifts');
      return Immutable.fromJS(rotaShifts).concat(Immutable.fromJS(securityVenueShifts));
    },
  },
  initialGlobalState,
);

export default rotaShiftsReducer;
