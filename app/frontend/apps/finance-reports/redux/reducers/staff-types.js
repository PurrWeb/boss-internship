import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const staffTypes = oFetch(action, 'payload.staffTypes');

      return Immutable.fromJS(staffTypes);
    },
  },
  initialState,
);
