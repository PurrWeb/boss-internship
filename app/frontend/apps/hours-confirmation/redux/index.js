import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import staffMembers from './staff-members';
import clockInPeriods from './clock-in-periods';
import staffTypes from './staff-types';
import hoursAcceptancePeriods from './hours-acceptance-periods';
import clockInBreaks from './clock-in-breaks';
import rotaShifts from './rota-shifts';
import clockInEvents from './clock-in-events';
import rotas from './rotas';
import hoursAcceptanceBreaks from './hours-acceptance-breaks';
import venue from './venue';
import pageOptions from './page-options';
import venues from './venues';
import clockInNotes from './clock-in-notes';

export default combineReducers({
  pageOptions,
  staffMembers,
  clockInPeriods,
  clockInBreaks,
  clockInNotes,
  staffTypes,
  hoursAcceptancePeriods,
  rotaShifts,
  clockInEvents,
  rotas,
  hoursAcceptanceBreaks,
  venue,
  venues,
  form: formReducer,
});
