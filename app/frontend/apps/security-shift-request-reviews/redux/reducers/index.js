import { combineReducers } from 'redux-immutable';
import securityShiftRequests from './security-shift-requests-reducer';
import venues from './venues-reducer';
import pageOptions from './page-options-reducer';

export default combineReducers({
  securityShiftRequests,
  venues,
  pageOptions,
});
