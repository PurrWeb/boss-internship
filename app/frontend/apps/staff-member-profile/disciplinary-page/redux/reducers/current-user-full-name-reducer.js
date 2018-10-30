import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = null;

const currentUserFullNameReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const currentUserFullName = oFetch(action, 'payload.currentUserFullName');
      return currentUserFullName;
    },
  },
  initialState,
);

export default currentUserFullNameReducer;
