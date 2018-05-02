import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import { fromJS } from '../../models';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const venues = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const venues = oFetch(action, 'payload.venues');

      return Immutable.fromJS(venues).map(fromJS.Venue);
    },
    [types.ADD_VENUE]: (state, action) => {
      const id = oFetch(action, 'payload.id');
      const name = oFetch(action, 'payload.name');
      const address = oFetch(action, 'payload.address');

      return state.push(fromJS.Venue({ id, name, address }));
    },
    [types.EDIT_VENUE]: (state, action) => {
      const id = oFetch(action, 'payload.id');
      const name = oFetch(action, 'payload.name');
      const address = oFetch(action, 'payload.address');

      const venueIndex = state.findIndex(venue => venue.id === id);
      return state.update(venueIndex, venue => fromJS.Venue({ id, name, address }));
    },
  },
  initialGlobalState,
);

export default venues;
