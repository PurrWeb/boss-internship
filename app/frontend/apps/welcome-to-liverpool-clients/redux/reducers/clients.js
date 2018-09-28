import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_WTL_CLIENTS]: (state, action) => {
      const clients = oFetch(action, 'payload.clients');
      return state.concat(Immutable.fromJS(clients));
    },
    [types.LOAD_WTL_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      return state.push(Immutable.fromJS(client));
    },
    [types.SET_WTL_CLIENTS]: (state, action) => {
      const clients = oFetch(action, 'payload.clients');
      return Immutable.fromJS(clients);
    },
    [types.ENABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      const clientId = oFetch(client, 'id');
      const clientIndex = state.findIndex(client => client.get('id') === clientId);
      return state.update(clientIndex, c => Immutable.fromJS(client));
    },
    [types.DISABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      const clientId = oFetch(client, 'id');
      const clientIndex = state.findIndex(client => client.get('id') === clientId);
      return state.update(clientIndex, c => Immutable.fromJS(client));
    },
    [types.UPDATE_CLIENT_PROFILE]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      const clientId = oFetch(client, 'id');
      const clientIndex = state.findIndex(client => client.get('id') === clientId);
      return state.update(clientIndex, c => Immutable.fromJS(client));
    },
  },
  initialState,
);
