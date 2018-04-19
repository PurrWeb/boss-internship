import { combineReducers } from 'redux-immutable';
import staffMembers from './staff-members-reducer';
import holidayRequests from './holiday-requests-reducer';
import permissions from './permissions-reducer';

export default combineReducers({
  staffMembers,
  holidayRequests,
  permissions
});
