import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';

import {
  INITIAL_LOAD,
  UPDATE_STAFF_MEMBER,
} from './constants';

const initialState = fromJS({
  staffMember: {},
});  

const staffMemberReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    return state.set('staffMember', fromJS(action.payload));
  },
  [UPDATE_STAFF_MEMBER]: (state, action) => {
    return state.set('staffMember', fromJS(action.payload));
  },
}, initialState);

export default staffMemberReducer;
