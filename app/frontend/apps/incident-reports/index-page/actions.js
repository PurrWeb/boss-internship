import { createAction } from 'redux-actions';
import utils from '~/lib/utils';
import moment from 'moment';

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
    incidentTime = moment(values.date).hour(values.time.hour()).minute(values.time.minute());
  }

  const parsedValues = {
    involvedWitnessDetails: convertRichToHtmlAndCheckIfEmpty(values.involvedWitnessDetails),
    report: convertRichToHtmlAndCheckIfEmpty(values.report),
    uninvolvedWitnessDetails: convertRichToHtmlAndCheckIfEmpty(values.uninvolvedWitnessDetails),
    policeOfficerDetails: convertRichToHtmlAndCheckIfEmpty(values.policeOfficerDetails),
  }

  return createIncidentReportRequest({values: {...values, ...parsedValues, incidentTime}, venueId})
    .then((resp) => {
      dispatch(addIncidentReport(resp.data))
      dispatch(hideAddNewReport());
      window.scrollTo(0, 0);
    });
}

export const handleVenueSelect = ({venueId}) => (dispatch, getState) => {

  return getIncidentReportsRequest({venueId})
    .then((resp) => {
      dispatch(setIncidentReports(resp.data));
      dispatch(setCurrentVenue(venueId));
      const params = {
        venue_id: venueId,
      }
      let queryParams = utils.parseQueryString(window.location.search.substring(1));
      
      const newParams = utils.insertUrlParams({...queryParams, venue_id: venueId});
      window.history.pushState('state', 'title', `incident_reports?${newParams}`);
    });
}

export const handleFilter = () => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);
  let startDate = getState().getIn(['page', 'filterStartDate']);
  let endDate = getState().getIn(['page', 'filterEndDate']);
  const creatorId = getState().getIn(['page', 'filterReportCreatorId']);

  startDate = startDate ? moment(startDate).format('DD-MM-YYYY') : null;
  endDate = startDate ? moment(endDate).format('DD-MM-YYYY') : null;

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
      
      // dispatch(hideAddNewReport());
      // window.scrollTo(0, 0);
    });
}

export const setIncidentReports = createAction(SET_INCIDENT_REPORTS);
