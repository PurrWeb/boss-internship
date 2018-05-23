import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const venuesReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const venues = oFetch(action, 'payload.venues');
      const securityVenues = oFetch(action, 'payload.securityVenues');
      return Immutable.fromJS(venues).concat(Immutable.fromJS(securityVenues));
    },
  },
  initialGlobalState,
);

export default venuesReducer;
