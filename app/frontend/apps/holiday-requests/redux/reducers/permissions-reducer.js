import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.fromJS({});

const PermissionsReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const payload = oFetch(action, 'payload');
      return Immutable.fromJS(oFetch(payload, 'permissionsData'));
    },
  },
  initialState,
);

export default PermissionsReducer;
