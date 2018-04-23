import oFetch from 'o-fetch';
import http from '~/lib/request-api';

export const markReportCompletedRequest = params => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const date = oFetch(params, 'date');

  return http({ successMessage: 'Report marked successfully' }).post(`/api/v1/finance_reports/${date}/complete`, {
    staffMemberId,
  });
};

export const markReportsCompletedRequest = params => {
  const staffMemberIds = oFetch(params, 'staffMemberIds');
  const date = oFetch(params, 'date');

  return http({ successMessage: 'Reports marked successfully' }).post(
    `/api/v1/finance_reports/${date}/complete_multiply`,
    {
      staffMemberIds,
    },
  );
};
