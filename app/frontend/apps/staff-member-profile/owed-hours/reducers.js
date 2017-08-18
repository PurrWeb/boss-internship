import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import { reducer as formReducer } from 'redux-form/immutable';
import moment from 'moment';

import {
  INITIAL_LOAD,
  ADD_NEW_OWED_HOUR,
  CANCEL_ADD_NEW_OWED_HOUR,
  DELETE_OWED_HOURS,
  EDIT_OWED_HOURS_SUCCESS,
  OPEN_EDIT_OWED_HOURS_MODAL,
  CLOSE_OWED_HOURS_MODAL,
  ADD_OWED_HOURS_SUCCESS,
  CANCEL_EDIT_OWED_HOURS,
  CLOSE_EDIT_OWED_HOURS_MODAL,
} from './constants';

const initialState = fromJS({
  staffMember: {},
  accessToken: null,
  owedhours: [],
  newOwedHour: false,
  editOwedHour: false,
  editedOwedHours: {},
});

const owedHoursReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const { 
      staffMember,
      accessToken,
      owedhours,
    } = action.payload;

    return state
      .set('staffMember', fromJS(staffMember))
      .set('accessToken', fromJS(accessToken))
      .set('owedhours', fromJS(owedhours))
  },
  [ADD_NEW_OWED_HOUR]: (state) => {
    return state
      .set('newOwedHour', true);
  },
  [ADD_OWED_HOURS_SUCCESS]: (state, action) => {
    const owedHours = fromJS(action.payload);
    
    return state
      .set('owedhours', owedHours);
  },
  [OPEN_EDIT_OWED_HOURS_MODAL]: (state, action) => {
    return state
      .set('editedOwedHours', fromJS(action.payload))
      .set('editOwedHour', true);
  },
  [CLOSE_EDIT_OWED_HOURS_MODAL]: (state, action) => {
    return state
    .set('editedOwedHours', fromJS({}))
    .set('editOwedHour', false);
  },
  [EDIT_OWED_HOURS_SUCCESS]: (state, action) => {
    return state
      .set('owedhours', fromJS(action.payload))
  },
  [CLOSE_OWED_HOURS_MODAL]: (state) => {
    return state
      .set('newOwedHour', false)
  },
  [CANCEL_ADD_NEW_OWED_HOUR]: (state) => {
    return state
      .set('newOwedHour', false)
  },
  [DELETE_OWED_HOURS]: (state, action) => {
    const owedHours = action.payload;

    return state
      .set('owedhours', fromJS(owedHours));
  },
}, initialState);

export default combineReducers({
  profile: owedHoursReducer,
  form: formReducer,
})

