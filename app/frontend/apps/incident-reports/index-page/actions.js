import { createAction } from 'redux-actions';
import utils from '~/lib/utils';
import safeMoment from "~/lib/safe-moment";
import notify from '~/components/global-notification';

import {
  INITIAL_LOAD,
  ADD_INCIDENT_REPORT,
  SHOW_ADD_NEW_REPORT,
  HIDE_ADD_NEW_REPORT,
  SET_INCIDENT_REPORTS,
  SET_CURRENT_VENUE,
  SET_CURRENT_CREATOR,
  SET_CURRENT_START_END,
} from './constants';

import {
  createIncidentReportRequest,
  getIncidentReportsRequest,
} from './requests';

export const initialLoad = createAction(INITIAL_LOAD);
export const addIncidentReport = createAction(ADD_INCIDENT_REPORT);
export const showAddNewReport = createAction(SHOW_ADD_NEW_REPORT);
export const hideAddNewReport = createAction(HIDE_ADD_NEW_REPORT);
export const setCurrentVenue = createAction(SET_CURRENT_VENUE);
export const setCurrentCreator = createAction(SET_CURRENT_CREATOR);
export const setCurrentStartEnd = createAction(SET_CURRENT_START_END);

function convertRichToHtmlAndCheckIfEmpty(value) {
  if (value.getEditorState().getCurrentContent().hasText()) {
    return value.toString('html');
  }
  return '';
}

export const createIncidentReport = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  let incidentTime = '';

  if (values.date && values.time) {
    const uiDate = values.date.format(utils.apiDateFormat);
    const newDate = safeMoment.uiDateParse(uiDate);
    incidentTime = newDate.hour(values.time.hour()).minute(values.time.minute()).toISOString().split('.')[0] + 'Z';
  }
  const newValues = { ...values, incidentTime };
  delete newValues.date;
  delete newValues.time;
  return createIncidentReportRequest({values: newValues, venueId})
    .then((resp) => {
      dispatch(addIncidentReport(resp.data))
      dispatch(hideAddNewReport());
      window.scrollTo(0, 0);
      notify('Incident Report Created Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}

export const handleVenueSelect = ({venueId}) => (dispatch, getState) => {
  let filterStartDate =  getState().getIn(['page', 'filterStartDate']);
  let startDate = filterStartDate && safeMoment.uiDateParse(filterStartDate).format("DD-MM-YYYY");

  let filterEndDate =  getState().getIn(['page', 'filterEndDate']);
  let endDate = filterEndDate && safeMoment.uiDateParse(filterEndDate).format("DD-MM-YYYY");

  const creatorId = getState().getIn(['page', 'filterReportCreatorId']);

  return getIncidentReportsRequest({venueId, startDate, endDate, creatorId})
    .then((resp) => {
      dispatch(setIncidentReports(resp.data));
      dispatch(setCurrentVenue(venueId));
      const queryParams = {
        venue_id: venueId,
        start_date: startDate,
        end_date: endDate,
        created_by: creatorId,
      }
      const newParams = utils.insertUrlParams({...queryParams, venue_id: venueId});
      window.history.pushState('state', 'title', `incident_reports?${newParams}`);
    });
}

export const handleFilter = () => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  let filterStartDate = getState().getIn(['page', 'filterStartDate']);
  let startDate = filterStartDate && safeMoment.uiDateParse(filterStartDate).format('DD-MM-YYYY');

  let filterEndDate = getState().getIn(['page', 'filterEndDate']);
  let endDate = filterEndDate && safeMoment.uiDateParse(filterEndDate).format('DD-MM-YYYY');

  const creatorId = getState().getIn(['page', 'filterReportCreatorId']);

  return getIncidentReportsRequest({venueId, startDate, endDate, creatorId})
    .then((resp) => {
      dispatch(setIncidentReports(resp.data))
      const params = {
        venue_id: venueId,
        start_date: startDate,
        end_date: endDate,
        created_by: creatorId,
      }
      const newParams = utils.insertUrlParams(params);
      window.history.pushState('state', 'title', `incident_reports?${newParams}`);
    });
}

export const setIncidentReports = createAction(SET_INCIDENT_REPORTS);