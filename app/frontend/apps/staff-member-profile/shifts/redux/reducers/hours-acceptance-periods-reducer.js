import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const hoursAcceptancePeriodsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const hoursAcceptancePeriods = oFetch(action, 'payload.hoursAcceptancePeriods');
      return Immutable.fromJS(hoursAcceptancePeriods);
    },
  },
  initialGlobalState,
);

export default hoursAcceptancePeriodsReducer;
