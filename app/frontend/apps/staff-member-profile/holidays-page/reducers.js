import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';

import { reducer as formReducer } from 'redux-form/immutable';
import safeMoment from "~/lib/safe-moment";

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
  FILTER,
  UPDATE_HOLIDAYS_COUNT,
  DELETE_HOLIDAY_REQUEST,
  EDIT_HOLIDAY_REQUEST_SUCCESS,
} from './constants';

const initialState = fromJS({
  staffMember: {},
  accessToken: null,
  holidays: [],
  holidayRequests: [],
  paidHolidayDays: null,
  unpaidHolidayDays: null,
  estimatedAccruedHolidayDays: null,
  holidayStartDate: null,
  holidayEndDate: null,
  newHoliday: false,
  editHoliday: false,
  editedHoliday: {},
  isAdminPlus: null,
  permissionsData: fromJS({})
});

const holidaysReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      staffMember,
      accessToken,
      holidays,
      holidayRequests,
      paidHolidayDays,
      unpaidHolidayDays,
      estimatedAccruedHolidayDays,
      holidayStartDate,
      holidayEndDate,
      isAdminPlus
    } = action.payload;

    const permissionsData = oFetch(action.payload, 'permissionsData');

    return state
      .set('staffMember', fromJS(staffMember))
      .set('accessToken', fromJS(accessToken))
      .set('holidays', fromJS(holidays))
      .set('holidayRequests', fromJS(holidayRequests))
      .set('paidHolidayDays', fromJS(paidHolidayDays))
      .set('unpaidHolidayDays', fromJS(unpaidHolidayDays))
      .set('estimatedAccruedHolidayDays', fromJS(estimatedAccruedHolidayDays))
      .set('holidayStartDate', safeMoment.uiDateParse(holidayStartDate))
      .set('holidayEndDate', safeMoment.uiDateParse(holidayEndDate))
      .set('isAdminPlus', isAdminPlus)
      .set('permissionsData', fromJS(permissionsData))
  },
  [UPDATE_HOLIDAYS_COUNT]: (state, action) => {
    const {
      paidHolidayDays,
      unpaidHolidayDays,
      estimatedAccruedHolidayDays,
    } = action.payload;

    return state
      .set('paidHolidayDays', paidHolidayDays)
      .set('unpaidHolidayDays', unpaidHolidayDays)
      .set('estimatedAccruedHolidayDays', estimatedAccruedHolidayDays)
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
  [DELETE_HOLIDAY_REQUEST]: (state, action) => {
    const id = action.payload.id

    return state
      .update('holidayRequests',
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
  [EDIT_HOLIDAY_REQUEST_SUCCESS]: (state, action) => {
    const editedItem = fromJS(action.payload);
    const id = editedItem.get('id');
    const index = state.get('holidayRequests').findIndex(item => item.get("id") === id);

    return state
      .setIn(['holidayRequests', index], editedItem)
  },
  [ADD_HOLIDAY_SUCCESS]: (state, action) => {
    const newHoliday = fromJS(action.payload);
    const isAdminPlus = state.get('isAdminPlus');
    if (isAdminPlus) {
      return state.update('holidays', holidays => holidays.push(newHoliday));
    } else {
      return state.update('holidayRequests', holidays => holidays.push(newHoliday));
    }
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
      holiday_requests,
    } = action.payload;

    return state
      .set('holidays', fromJS(holidays))
      .set('holidayRequests', fromJS(holiday_requests))
      .set('paidHolidayDays', fromJS(paid_holiday_days))
      .set('unpaidHolidayDays', fromJS(unpaid_holiday_days))
      .set('estimatedAccruedHolidayDays', fromJS(estimated_accrued_holiday_days))
  }
}, initialState);

export default holidaysReducer;

