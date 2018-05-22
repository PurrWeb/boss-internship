import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const hoursAcceptanceBreaksReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const hoursAcceptanceBreaks = oFetch(action, 'payload.hoursAcceptanceBreaks');
      return Immutable.fromJS(hoursAcceptanceBreaks);
    },
  },
  initialGlobalState,
);

export default hoursAcceptanceBreaksReducer;
