import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const assignShiftRequestRequest = params => {
  const id = oFetch(params, 'id');
  const staffMemberId = oFetch(params, 'staffMemberId');

  return http({
    successMessage: 'Request Assigned Successfully',
    errorMessage: 'Request Assignment Failed',
  }).post(`/api/v1/security-shift-requests/${id}/assign`, {
    staffMemberId,
  });
};

export const rejectShiftRequestRequest = params => {
  const id = oFetch(params, 'id');
  const rejectReason = oFetch(params, 'rejectReason');

  return http({
    successMessage: 'Request Rejected Successfully',
    errorMessage: 'Request Rejecting Failed',
  }).post(`/api/v1/security-shift-requests/${id}/reject`, { rejectReason });
};
