import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = null;
export default handleActions(
  {
    [types.LOAD_WTL_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      return Immutable.fromJS(client);
    },
    [types.ENABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      return Immutable.fromJS(client);
    },
    [types.DISABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      return Immutable.fromJS(client);
    },
    [types.UPDATE_CLIENT_PROFILE]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      return Immutable.fromJS(client);
    },
  },
  initialState,
);
