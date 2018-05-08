import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const shiftsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const shifts = oFetch(action, 'payload.shifts');
      return Immutable.fromJS(shifts);
    },
  },
  initialGlobalState,
);

export default shiftsReducer;
