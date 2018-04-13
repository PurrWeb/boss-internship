import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

import * as types from '../types';

const initialGlobalState = Immutable.List();

const staffMembersReducer = handleActions(
  {
    [types.INITIAL_LOAD]: (state, action) => {
      const payload = oFetch(action, 'payload');
      return Immutable.fromJS(oFetch(payload, 'staffMembers'));
    },
    [types.REMOVE_STAFF_MEMBER]: (state, action) => {
      const staffMemberId = oFetch(action, 'payload');

      return state.filter(staffMembers => staffMembers.get('id') !== staffMemberId);
    },
  },
  initialGlobalState,
);

export default staffMembersReducer;
