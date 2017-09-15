import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';

import { reducer as formReducer } from 'redux-form/immutable';
import moment from 'moment';

import {
  INITIAL_LOAD,
  ADD_NEW_HOLIDAY,
  CANCEL_ADD_NEW_HOLIDAY,
  DELETE_HOLIDAY,
  ADD_HOLIDAY_SUCCESS,
  CLOSE_HOLIDAY_MODAL,
  OPEN_EDIT_HOLIDAY_MODAL,
  CLOSE_EDIT_HOLIDAY_MODAL,
  EDIT_HOLIDAY_SUCCESS,
  FILTER
} from './constants';

const initialState = fromJS({
  staffMember: {},
  accessToken: null,
  holidays: [],
  paidHolidayDays: null,
  unpaidHolidayDays: null,
  estimatedAccruedHolidayDays: null,
  holidayStartDate: null,
  holidayEndDate: null,
  newHoliday: false,
  editHoliday: false,
  editedHoliday: {}
});

const holidaysReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const { 
      staffMember,
      accessToken,
      holidays,
      paidHolidayDays,
      unpaidHolidayDays,
      estimatedAccruedHolidayDays,
      holidayStartDate,
      holidayEndDate,
    } = action.payload;

    return state
      .set('staffMember', fromJS(staffMember))
      .set('accessToken', fromJS(accessToken))
      .set('holidays', fromJS(holidays))
      .set('paidHolidayDays', fromJS(paidHolidayDays))
      .set('unpaidHolidayDays', fromJS(unpaidHolidayDays))
      .set('estimatedAccruedHolidayDays', fromJS(estimatedAccruedHolidayDays))
      .set('holidayStartDate', moment(holidayStartDate))
      .set('holidayEndDate', moment(holidayEndDate))
  },
  [ADD_NEW_HOLIDAY]: (state) => {
    return state
      .set('newHoliday', true)
  },
  [CANCEL_ADD_NEW_HOLIDAY]: (state) => {
    return state
      .set('newHoliday', false)
  },
  [DELETE_HOLIDAY]: (state, action) => {
    const id = action.payload.id
    
    return state
      .update('holidays',
      (holidays) => holidays.filter(
        (item) => item.get('id') !== id
      )
    )
  },
  [EDIT_HOLIDAY_SUCCESS]: (state, action) => {
    const editedItem = fromJS(action.payload);
    const id = editedItem.get('id');
    const index = state.get('holidays').findIndex(item => item.get("id") === id);

    return state
      .setIn(['holidays', index], editedItem)
  },
  [ADD_HOLIDAY_SUCCESS]: (state, action) => {
    const newHoliday = fromJS(action.payload);

    return state
      .update('holidays', holidays => holidays.push(newHoliday));
  },
  [CLOSE_HOLIDAY_MODAL]: (state) => {
    return state
      .set('newHoliday', false);
  },
  [OPEN_EDIT_HOLIDAY_MODAL]: (state, action) => {
    return state
      .set('editHoliday', true)
      .set('editedHoliday',fromJS(action.payload))
  },
  [CLOSE_EDIT_HOLIDAY_MODAL]: (state) => {
    return state
      .set('editHoliday', false)
      .set('editedHoliday', fromJS({}))
  },
  [CLOSE_HOLIDAY_MODAL]: (state) => {
    return state.
      set('newHoliday', false);
  },
  [FILTER]: (state, action) => {
    const {
      holidays,
      paid_holiday_days,
      unpaid_holiday_days,
      estimated_accrued_holiday_days,
      holidayStartDate,
      holidayEndDate,
    } = action.payload;

    return state
      .set('holidays', fromJS(holidays))
      .set('paidHolidayDays', fromJS(paid_holiday_days))
      .set('unpaidHolidayDays', fromJS(unpaid_holiday_days))
      .set('estimatedAccruedHolidayDays', fromJS(estimated_accrued_holiday_days))
  }
}, initialState);

export default holidaysReducer;

