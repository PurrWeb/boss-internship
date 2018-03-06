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

export default combineReducers({
  staffMembers,
  clockInPeriods,
  clockInBreaks,
  staffTypes,
  hoursAcceptancePeriods,
  rotaShifts,
  clockInEvents,
  rotas,
  hoursAcceptanceBreaks,
  form: formReducer,
});
