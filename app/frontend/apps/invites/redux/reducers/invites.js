import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialState = Immutable.List();

export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const invites = oFetch(action, 'payload.invites');
      return Immutable.fromJS(invites);
    },
    [types.INVITE_USER]: (state, action) => {
      const invite = oFetch(action, 'payload.invite');
      return state.push(Immutable.fromJS(invite));
    },
    [types.UPDATE_INVITE]: (state, action) => {
      const invite = oFetch(action, 'payload.invite');
      const inviteId = oFetch(invite, 'id');
      const inviteIndex = state.findIndex(invite => invite.get('id') === inviteId);
      return state.set(inviteIndex, Immutable.fromJS(invite));
    },
  },
  initialState,
);
