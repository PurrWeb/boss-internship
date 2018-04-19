import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = null;
export default handleActions(
  {
    [types.SET_ASSIGNING_SHIFT_REQUEST]: (state, action) => {
      return action.payload;
    },
  },
  initialState,
);
