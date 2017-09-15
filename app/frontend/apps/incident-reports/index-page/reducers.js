import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

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

const initialState = fromJS({
  currentVenueId: null,
  accessToken: null,
  accessibleVenues: [],
  reportCreators: [],
  incidentReports: [],
  filterStartDate: null,
  filterEndDate: null,
  filterReportCreatorId: null,
  addingNewReport: false,
});

const incidentReportsIndexReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      currentVenueId,
      accessToken,
      accessibleVenues,
      reportCreators,
      incidentReports,
      filterStartDate,
      filterEndDate,
      filterReportCreatorId,
    } = action.payload;
    
    return state
      .set('currentVenueId', currentVenueId)
      .set('accessToken', accessToken)
      .set('accessibleVenues', fromJS(accessibleVenues))
      .set('reportCreators', fromJS(reportCreators))
      .set('incidentReports', fromJS(incidentReports))
      .set('filterStartDate', moment(filterStartDate, 'DD-MM-YYYY'))
      .set('filterEndDate', moment(filterEndDate, 'DD-MM-YYYY'))
      .set('filterReportCreatorId', filterReportCreatorId)
  },
  [ADD_INCIDENT_REPORT]: (state, action) => {
    const newIncidentReport = action.payload;
    return state
      .update('incidentReports',
        incidentReports => incidentReports.push(fromJS(newIncidentReport)))

  },
  [SET_INCIDENT_REPORTS]: (state, action) => {
    return state
      .set('incidentReports', fromJS(action.payload))
  },
  [SET_CURRENT_VENUE]: (state, action) => {
    return state
      .set('currentVenueId', action.payload)
  },
  [SET_CURRENT_CREATOR]: (state, action) => {
    return state
      .set('filterReportCreatorId', action.payload)
  },
  [SET_CURRENT_START_END]: (state, action) => {
    const {
      startDate,
      endDate,
    } = action.payload;

    return state
      .set('filterStartDate', startDate)
      .set('filterEndDate', endDate)
  },
  [SHOW_ADD_NEW_REPORT]: (state) => {
    return state.set('addingNewReport', true)
  },
  [HIDE_ADD_NEW_REPORT]: (state) => {
    return state.set('addingNewReport', false)
  },
}, initialState);

export default combineReducers({
  page: incidentReportsIndexReducer,
  form: formReducer,
})
