import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.Map({
  startDate: null,
  endDate: null,
  venueId: null,
  date: null,
});

const pageOptionsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const date = oFetch(action, 'payload.date');
      const startDate = oFetch(action, 'payload.startDate');
      const endDate = oFetch(action, 'payload.endDate');
      const venueId = oFetch(action, 'payload.venueId');
      const canCreate = oFetch(action, 'payload.canCreate');
      const chosenDate = oFetch(action, 'payload.date');

      return Immutable.fromJS({
        date,
        startDate,
        endDate,
        venueId,
        canCreate,
        chosenDate,
      });
    },
    [types.CHANGE_WEEK_DAY]: (state, action) => {
      const chosenDate = oFetch(action, 'payload.chosenDate');
      return state.set('chosenDate', chosenDate);
    },
  },
  initialGlobalState,
);

export default pageOptionsReducer;
