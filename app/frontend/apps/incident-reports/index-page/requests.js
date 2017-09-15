import axios from 'axios';

const http = axios.create();

export const createIncidentReportRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  const {
    values,
    venueId,
  } = requestData;

  return http.post(`/api/v1/incident_reports`, {
    ...values,
    venueId
  });
}

export const getIncidentReportsRequest = ({venueId, startDate, endDate, creatorId}) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.accessToken}"`;

  return http.get(`/api/v1/incident_reports`, {
    params: {
      venueId,
      startDate,
      endDate,
      creatorId
    }
  });
}
