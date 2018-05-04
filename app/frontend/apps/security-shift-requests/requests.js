import axios from 'axios';
import http from '~/lib/request-api';
import oFetch from 'o-fetch';

export const addSecurityShiftRequestRequest = values => {
  return http({ successMessage: 'Rota Shift Request Added Successfully' }).post(`/api/v1/security-shift-requests`, {
    ...values,
  });
};

export const updateSecurityShiftRequestRequest = values => {
  const securityShiftRequestId = oFetch(values, 'id');
  return http({ successMessage: 'Security Shift Request Accepted Successfully' }).put(
    `/api/v1/security-shift-requests/${securityShiftRequestId}`,
    {
      ...values,
    },
  );
};

export const deleteSecurityShiftRequestRequest = params => {
  const securityShiftRequestId = oFetch(params, 'id');
  return http({ successMessage: 'Security Shift Request Deleted Successfully' }).delete(
    `/api/v1/security-shift-requests/${securityShiftRequestId}`,
  );
};
