import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = null;

const appealToNameReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const appealToName = oFetch(action, 'payload.appealToName');
      return appealToName;
    },
  },
  initialState,
);

export default appealToNameReducer;
