import { createAction } from 'redux-actions';
import safeMoment from "~/lib/safe-moment";
import utils from '~/lib/utils';
import notify from '~/components/global-notification';

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
      notify('Incident Report Disabled Successfully', {
        interval: 5000,
        status: 'success'
      });
      window.location = '/incident_reports';
    })
}

function convertRichToHtmlAndCheckIfEmpty(value) {
  if (value.getEditorState().getCurrentContent().hasText()) {
    return value.toString('html');
  }
  return '';
}

export const saveIncidentReport = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);
  let incidentTime = null;

  if (values.date && values.time) {
    const uiDate = values.date.format(utils.apiDateFormat);
    const newDate = safeMoment.uiDateParse(uiDate);
    incidentTime = newDate.hour(values.time.hour()).minute(values.time.minute()).toISOString().split('.')[0] + 'Z';
  }
  const newValues = { ...values, incidentTime };
  delete newValues.date;
  delete newValues.time;
  return saveIncidentReportRequest({values: newValues, venueId})
    .then((resp) => {
      dispatch(updateIncidentReport(resp.data))
      dispatch(hideEditReport());
      window.scrollTo(0, 0);
      notify('Incident Report Updated Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}