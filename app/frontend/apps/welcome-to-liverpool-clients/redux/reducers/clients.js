import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const clients = oFetch(action, 'payload.clients');
      return Immutable.fromJS(clients);
    },
    [types.ENABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      const clientId = oFetch(client, 'id');
      const disabled = oFetch(client, 'disabled');
      const clientIndex = state.findIndex(client => client.get('id') === clientId);
      return state.update(clientIndex, client => client.set('disabled', disabled));
    },
    [types.DISABLE_CLIENT]: (state, action) => {
      const client = oFetch(action, 'payload.client');
      const clientId = oFetch(client, 'id');
      const disabled = oFetch(client, 'disabled');
      const clientIndex = state.findIndex(client => client.get('id') === clientId);
      return state.update(clientIndex, client => client.set('disabled', disabled));
    },
  },
  initialState,
);
