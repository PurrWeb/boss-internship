import { createAction } from 'redux-actions';
import moment from 'moment';

import {
  INITIAL_LOAD,
  UPDATE_INCIDENT_REPORT,
  SHOW_EDIT_REPORT,
  HIDE_EDIT_REPORT,
  DISABLE_REPORT,
} from './constants';

import {
  saveIncidentReportRequest,
  disableIncidentReportRequest,
} from './requests';

export const initialLoad = createAction(INITIAL_LOAD);
export const updateIncidentReport = createAction(UPDATE_INCIDENT_REPORT);
export const showEditReport = createAction(SHOW_EDIT_REPORT);
export const hideEditReport = createAction(HIDE_EDIT_REPORT);

export const disableIncidentReport = (incidentReportId) => (dispatch, getState) => {
  return disableIncidentReportRequest(incidentReportId)
    .then(() => {
      console.log('What to do next?');
    })
}

export const saveIncidentReport = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);
  let incidentTime = null;

  if (values.date && values.time) {
    values.date.hour(values.time.hour24).minute(values.time.minute);
    incidentTime = values.date;
  }

  return saveIncidentReportRequest({values: {...values, incidentTime}, venueId})
    .then((resp) => {
      dispatch(updateIncidentReport(resp.data))
      dispatch(hideEditReport());
      window.scrollTo(0, 0);
    });
}
