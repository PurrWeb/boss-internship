import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.Map({
  startDate: null,
  endDate: null,
  venueFilter: null,
  date: null,
});

const pageOptionsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const date = oFetch(action, 'payload.date');
      const accessibleVenues = oFetch(action, 'payload.accessibleVenues');
      const startDate = oFetch(action, 'payload.startDate');
      const endDate = oFetch(action, 'payload.endDate');
      const venueFilter = oFetch(action, 'payload.venueFilter');
      const canCreate = oFetch(action, 'payload.canCreate');
      const chosenDate = oFetch(action, 'payload.date');

      return Immutable.fromJS({
        date,
        startDate,
        endDate,
        venueFilter: venueFilter === 'all' ? null : parseInt(venueFilter),
        canCreate,
        chosenDate,
        accessibleVenues,
      });
    },
    [types.CHANGE_WEEK_DAY]: (state, action) => {
      const chosenDate = oFetch(action, 'payload.chosenDate');
      return state.set('chosenDate', chosenDate);
    },
    [types.CHANGE_VENUE_FILTER]: (state, action) => {
      const venueFilter = oFetch(action, 'payload');
      return state.set('venueFilter', venueFilter);
    },
  },
  initialGlobalState,
);

export default pageOptionsReducer;
