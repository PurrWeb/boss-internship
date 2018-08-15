import oFetch from 'o-fetch';
import http from '~/lib/request-api';
import { openErrorModal } from '~/components/modals';

export const markReportCompletedRequest = params => {
  const staffMemberId = oFetch(params, 'staffMemberId');
  const date = oFetch(params, 'date');
  const venueId = oFetch(params, 'venueId');

  return http({ successMessage: 'Report marked successfully' }).post(`/api/v1/finance_reports/${date}/complete`, {
    staffMemberId,
    venueId
  }).catch(error => {
    openErrorModal();
    return Promise.reject(error);
  });
};

export const markReportsCompletedRequest = params => {
  const staffMemberIds = oFetch(params, 'staffMemberIds');
  const date = oFetch(params, 'date');
  const venueId = oFetch(params, 'venueId');

  return http({ successMessage: 'Reports marked successfully' }).post(
    `/api/v1/finance_reports/${date}/complete_multiply`,
    {
      staffMemberIds,
      venueId
    },
  ).catch(error => {
    openErrorModal();
    return Promise.reject(error);
  });
};
