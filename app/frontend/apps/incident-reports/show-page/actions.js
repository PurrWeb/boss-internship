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
    incidentTime = moment(values.date).hour(values.time.hour()).minute(values.time.minute());
  }
  
  const parsedValues = {
    involvedWitnessDetails: convertRichToHtmlAndCheckIfEmpty(values.involvedWitnessDetails),
    report: convertRichToHtmlAndCheckIfEmpty(values.report),
    uninvolvedWitnessDetails: convertRichToHtmlAndCheckIfEmpty(values.uninvolvedWitnessDetails),
    policeOfficerDetails: convertRichToHtmlAndCheckIfEmpty(values.policeOfficerDetails),
  }

  return saveIncidentReportRequest({values: {...values, ...parsedValues, incidentTime}, venueId})
    .then((resp) => {
      dispatch(updateIncidentReport(resp.data))
      dispatch(hideEditReport());
      window.scrollTo(0, 0);
    });
}
