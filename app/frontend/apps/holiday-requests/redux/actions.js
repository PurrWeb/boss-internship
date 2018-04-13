import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';
import {
  acceptHolidayRequestRequest,
  rejectHolidayRequestRequest
} from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const removeHolidayRequest = createAction(types.REMOVE_HOLIDAY_REQUEST);
export const removeStaffMember = createAction(types.REMOVE_STAFF_MEMBER);

export const acceptHolidayRequest = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const holidayRequestId = oFetch(params, 'holidayRequestId');
  return acceptHolidayRequestRequest({staffMemberId, holidayRequestId}).then(response => {
    dispatch(removeHolidayRequest(holidayRequestId));
    const holidayRequests = getState().get('holidayRequests');
    const staffMemberHolidayRequests = holidayRequests.filter(
      holidayRequest => holidayRequest.get('staffMemberId') === staffMemberId,
    );

    if (staffMemberHolidayRequests.size === 0) {
      dispatch(removeStaffMember(staffMemberId));
    }
  })
};

export const rejectHolidayRequest = params => (dispatch, getState) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const holidayRequestId = oFetch(params, 'holidayRequestId');
  return rejectHolidayRequestRequest({staffMemberId, holidayRequestId}).then(response => {
    dispatch(removeHolidayRequest(holidayRequestId));
    const holidayRequests = getState().get('holidayRequests');
    const staffMemberHolidayRequests = holidayRequests.filter(
      holidayRequest => holidayRequest.get('staffMemberId') === staffMemberId,
    );

    if (staffMemberHolidayRequests.size === 0) {
      dispatch(removeStaffMember(staffMemberId));
    }
  })
};
