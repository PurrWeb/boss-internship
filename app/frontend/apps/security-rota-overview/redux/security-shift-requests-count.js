import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import * as types from './types';

const initialState = fromJS({});
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const { securityShiftRequestsCount } = action.payload;
      return fromJS(securityShiftRequestsCount);
    },
  },
  initialState,
);
