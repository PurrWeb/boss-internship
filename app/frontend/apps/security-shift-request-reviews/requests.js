import axios from 'axios';
import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const acceptSecurityShiftRequestRequest = securityShiftRequestId => {
  return http({ successMessage: 'Security Shift Request Accepted Successfully' }).post(
    `/api/v1/security-shift-requests/${securityShiftRequestId}/accept`,
  );
};

export const undoSecurityShiftRequestRequest = securityShiftRequestId => {
  return http({ successMessage: 'Security Shift Request Accepted Successfully' }).post(
    `/api/v1/security-shift-requests/${securityShiftRequestId}/undo`,
  );
};

export const updateSecurityShiftRequestRequest = values => {
  const securityShiftRequestId = oFetch(values, 'id');
  return http({ successMessage: 'Security Shift Request Accepted Successfully' }).put(
    `/api/v1/security-shift-requests/${securityShiftRequestId}`, {
      ...values
    }
  );
};

export const rejectSecurityShiftRequestRequest = (securityShiftRequestId, rejectNote) => {
  return http({ successMessage: 'Security Shift Request Rejected Successfully' }).post(
    `/api/v1/security-shift-requests/${securityShiftRequestId}/reject`,
    {
      rejectNote,
    },
  );
};
