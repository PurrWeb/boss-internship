import axios from 'axios';
import oFetch from 'o-fetch';

export function http() {
  const instance = axios.create();
  instance.defaults.headers.common['Authorization'] = `Token token="${
    window.boss.accessToken
  }"`;

  return instance;
}

export function unacceptPeriodRequest(period) {
  return http().put(`/api/v1/hours_acceptance_periods/${period.id}`, {
    ...period,
    status: 'pending',
  });
}

export function acceptPeriodRequest(period, currentVenueId) {
  if (period.id === null) {
    return http().post(`/api/v1/hours_acceptance_periods`, {
      ...period,
      venueId: currentVenueId,
      status: 'accepted',
    });
  } else {
    return http().put(`/api/v1/hours_acceptance_periods/${period.id}`, {
      ...period,
      status: 'accepted',
    });
  }
}

export function deletePeriodRequest(periodId) {
  return http().delete(`/api/v1/hours_acceptance_periods/${periodId}`);
}

export function clockOutRequest(data) {
  const staffMemberId = oFetch(data, 'staffMemberId');
  const date = oFetch(data, 'date');
  const venueId = oFetch(data, 'venueId');
  return http().post(`/api/v1/hours_acceptance_periods/clock_out`, {
    staffMember: staffMemberId,
    date,
    venueId,
  });
}
