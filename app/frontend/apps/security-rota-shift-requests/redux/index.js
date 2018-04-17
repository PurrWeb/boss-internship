import { combineReducers } from 'redux-immutable';
import securityRotaVenues from './security-rota-venues';
import securityRotaShiftRequests from './security-rota-shift-requests';
import securityRotaPageOptions from './security-rota-page-options';


export default combineReducers({
  venues: securityRotaVenues,
  shiftRequests: securityRotaShiftRequests,
  page: securityRotaPageOptions,
});
