import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from '../types';

const initialState = null;

const companyNameReducer = handleActions(
  {
    [types.LOAD_DISCIPLINARIES_SUCCEED]: (state, action) => {
      const companyName = oFetch(action, 'payload.companyName');
      return companyName;
    },
  },
  initialState,
);

export default companyNameReducer;
