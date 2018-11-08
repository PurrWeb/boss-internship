import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';

import {
  INITIAL_LOAD,
  ADD_HOLIDAY,
  ADD_STAFF_MEMBER,
  CALCULATE_HOLIDAYS,
  CALCULATE_STAFF_MEMBERS,
} from './constants';

import {
  createHolidayRequest,
} from './requests';

export const initialLoad = createAction(INITIAL_LOAD);
export const addHoliday = createAction(ADD_HOLIDAY);
export const addStaffMember = createAction(ADD_STAFF_MEMBER);
export const calculateHolidays = createAction(CALCULATE_HOLIDAYS);
export const calculateStaffMembers = createAction(CALCULATE_STAFF_MEMBERS);

export const createHoliday = (values, hideModal) => (dispatch, getState) => {
  return createHolidayRequest(values).then(resp => {
    hideModal();
    dispatch([
      addStaffMember(oFetch(values, 'staffMember.model')),
      addHoliday(resp.data),
      calculateHolidays(),
      calculateStaffMembers(),
    ]);
    return resp.data;
  });
}  
