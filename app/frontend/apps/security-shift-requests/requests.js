import axios from 'axios';
import http from '~/lib/request-api';

export const addSecurityShiftRequestRequest = values => {
  return http({ successMessage: 'Rota Shift Request Added Successfully' }).post(
    `/api/v1/security-shift-requests`,
    {
      ...values,
    },
  );
};
