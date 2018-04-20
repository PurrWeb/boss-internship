import { combineReducers } from 'redux-immutable';
import staffMembers from './staff-members-reducer';
import holidayRequests from './holiday-requests-reducer';
import permissionsData from './permissions-reducer';

export default combineReducers({
  staffMembers,
  holidayRequests,
  permissionsData
});
