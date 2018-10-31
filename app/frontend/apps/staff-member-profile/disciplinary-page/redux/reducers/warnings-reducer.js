import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = Immutable.fromJS({});

const warningsReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const warnings = oFetch(action, 'payload.warnings');
      return Immutable.fromJS(warnings);
    },
  },
  initialState,
);

export default warningsReducer;
