import axios from 'axios';

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
    status: 'pending'
  });
}

export function acceptPeriodRequest(period, currentVenueId) {
  if (period.id === null) {
    return http().post(`/api/v1/hours_acceptance_periods`, {
      ...period,
      venueId: currentVenueId,
      status: 'accepted'
    });
  } else {
    return http().put(`/api/v1/hours_acceptance_periods/${period.id}`, {
      ...period,
      status: 'accepted'
    });
  }
}

export function deletePeriodRequest(periodId) {
  return http().delete(`/api/v1/hours_acceptance_periods/${periodId}`);
}
