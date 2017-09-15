import axios from 'axios';

const http = axios.create();

export const saveIncidentReportRequest = (requestData) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;

  const {
    values,
  } = requestData;
  
  return http.put(`/api/v1/incident_reports/${values.id}`, {
    ...values,
  });
}

export const disableIncidentReportRequest = (incidentReportId) => {
  http.defaults.headers.common['Authorization'] = `Token token="${window.boss.store.accessToken}"`;
  
  return http.delete(`/api/v1/incident_reports/${incidentReportId}`);
}
