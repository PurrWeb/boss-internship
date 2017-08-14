import { fromJS, Map, List } from 'immutable';
import { handleActions } from 'redux-actions';
import moment from 'moment';

import {
  INITIAL_LOAD,
  ADD_NEW_HOLIDAY,
  CANCEL_ADD_NEW_HOLIDAY,
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

export default handleActions({
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
  }
}, initialState);
