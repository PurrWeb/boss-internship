import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import {INITIAL} from './constants'

const initialState = fromJS({
  vouchers: [],
  venueStaffMembers: [],
});

const redeemVouchersReducer = handleActions({
  [INITIAL]: (state, action) => {
    return state
      .set('vouchers', fromJS(action.payload.vouchers))
      .set('venueStaffMembers', fromJS(action.payload.venueStaffMembers))
   }
}, initialState);

export default combineReducers({
  page: redeemVouchersReducer,
  form: formReducer,
})
