import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = Immutable.fromJS({});

const warningLimitsReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const warningLimits = oFetch(action, 'payload.warningLimits');
      return Immutable.fromJS(warningLimits);
    },
  },
  initialState,
);

export default warningLimitsReducer;
