import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.Map();

const venuesReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const pageOptions = oFetch(action, 'payload.pageOptions');
      const startDate = oFetch(pageOptions, 'startDate');
      const endDate = oFetch(pageOptions, 'endDate');
      const venueId = oFetch(pageOptions, 'venueId');
      const venueType = oFetch(pageOptions, 'venueType');

      return Immutable.fromJS({ startDate, endDate, venueId, venueType });
    },
  },
  initialGlobalState,
);

export default venuesReducer;
