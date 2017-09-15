import { fromJS, Map, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form/immutable';

import moment from 'moment';

import {
  INITIAL_LOAD,
  UPDATE_INCIDENT_REPORT,
  SHOW_EDIT_REPORT,
  HIDE_EDIT_REPORT,
} from './constants';

const initialState = fromJS({
  accessToken: null,
  incidentReport: null,
});

const incidentReportsShowReducer = handleActions({
  [INITIAL_LOAD]: (state, action) => {
    const {
      accessToken,
      incidentReport,
    } = action.payload;
    
    return state
      .set('accessToken', accessToken)
      .set('incidentReport', fromJS(incidentReport))
  },
  [UPDATE_INCIDENT_REPORT]: (state, action) => {
    const updatedIncidentReport = action.payload;
    return state
      .set('incidentReport', fromJS(updatedIncidentReport))

  },
  [SHOW_EDIT_REPORT]: (state) => {
    return state.set('editingReport', true)
  },
  [HIDE_EDIT_REPORT]: (state) => {
    return state.set('editingReport', false)
  },
}, initialState);

export default combineReducers({
  page: incidentReportsShowReducer,
  form: formReducer,
})
