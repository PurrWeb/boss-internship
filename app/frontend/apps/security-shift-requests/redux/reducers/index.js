import { combineReducers } from 'redux-immutable';
import securityShiftRequests from './security-shift-requests-reducer';
import rotaShifts from './rota-shifts-reducer';
import pageOptions from './page-options-reducer';

export default combineReducers({
  securityShiftRequests,
  pageOptions,
  rotaShifts,
});
