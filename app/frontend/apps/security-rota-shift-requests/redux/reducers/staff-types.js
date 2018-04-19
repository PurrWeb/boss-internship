import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const securityShiftRequests = handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const staffTypes = oFetch(action, 'payload.staffTypes');

      return Immutable.fromJS(staffTypes);
    },
  },
  initialGlobalState,
);

export default securityShiftRequests;
