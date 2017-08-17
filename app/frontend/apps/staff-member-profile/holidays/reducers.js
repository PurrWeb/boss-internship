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
  [ADD_HOLIDAY_SUCCESS]: (state, action) => {
    let holidays = state.get('holidays');

    holidays.push(fromJS(action.payload));
    return state
      .set('holidays', fromJS(holidays));
  },
  [CLOSE_HOLIDAY_MODAL]: (state) => {
    return state.
      set('newHoliday', false);
  },
  [FILTER]: (state, action) => {
    const {
      holidays,
      paidHolidayDays,
      unpaidHolidayDays,
      estimatedAccruedHolidayDays,
      holidayStartDate,
      holidayEndDate,
    } = action.payload;

    return state
      .set('holidays', fromJS(holidays))
      .set('paidHolidayDays', fromJS(paidHolidayDays))
      .set('unpaidHolidayDays', fromJS(unpaidHolidayDays))
      .set('estimatedAccruedHolidayDays', fromJS(estimatedAccruedHolidayDays))
      .set('holidayStartDate', moment(holidayStartDate))
      .set('holidayEndDate', moment(holidayEndDate))
  }
}, initialState);

export default combineReducers({
  profile: holidaysReducer,
  form: formReducer,
})

