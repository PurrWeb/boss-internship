import oFetch from 'o-fetch';
import http from '~/lib/request-api';

export const acceptHolidayRequestRequest = (params) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const holidayRequestId = oFetch(params, 'holidayRequestId');

  return http().post(`/api/v1/holiday-requests/${holidayRequestId}/accept`, {
    staffMemberId
  })
}

export const rejectHolidayRequestRequest = (params) => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const holidayRequestId = oFetch(params, 'holidayRequestId');

  return http().post(`/api/v1/holiday-requests/${holidayRequestId}/reject`, {
    staffMemberId
  })
}
