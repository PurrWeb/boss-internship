import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = {};
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const startDate = oFetch(action, 'payload.startDate');
      const endDate = oFetch(action, 'payload.endDate');
      const date = oFetch(action, 'payload.date');
      const chosenDate = oFetch(action, 'payload.date');
      return { startDate, endDate, date, chosenDate, selectedVenues: []};
    },
    [types.CHANGE_WEEK_DAY]: (state, action) => {
      const chosenDate = oFetch(action, 'payload.chosenDate');
      return { ...state, chosenDate };
    },
    [types.SELECT_VENUE]: (state, action) => {
      const venueIds = oFetch(action, 'payload.venueIds');
      return { ...state, selectedVenues: venueIds };
    },
  },
  initialState,
);
