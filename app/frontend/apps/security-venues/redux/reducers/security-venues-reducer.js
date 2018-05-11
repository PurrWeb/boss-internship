import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const venues = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const securityVenues = oFetch(action, 'payload.securityVenues');

      return Immutable.fromJS(securityVenues);
    },
    [types.ADD_VENUE]: (state, action) => {
      return state.push(Immutable.fromJS(action.payload));
    },
    [types.EDIT_VENUE]: (state, action) => {
      const id = oFetch(action, 'payload.id');
      const updatedSecurityVenue = oFetch(action, 'payload');
      const venueIndex = state.findIndex(venue => venue.get('id') === id);
      return state.update(venueIndex, venue => Immutable.fromJS(updatedSecurityVenue));
    },
  },
  initialGlobalState,
);

export default venues;
