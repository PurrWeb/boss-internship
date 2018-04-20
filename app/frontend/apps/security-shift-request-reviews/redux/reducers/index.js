import { combineReducers } from 'redux-immutable';
import securityShiftRequests from './security-shift-requests-reducer';
import venues from './venues-reducer';
import pageOptions from './page-options-reducer';
import staffMembers from './staff-members-reducer';
import rotaShifts from './rota-shifts-reducer';
import permissions from './permissions-reducer';

export default combineReducers({
  securityShiftRequests,
  venues,
  pageOptions,
  staffMembers,
  rotaShifts,
  permissions,
});
