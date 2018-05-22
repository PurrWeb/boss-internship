import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const venuesReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const venues = oFetch(action, 'payload.venues');
      return Immutable.fromJS(venues);
    },
  },
  initialGlobalState,
);

export default venuesReducer;
