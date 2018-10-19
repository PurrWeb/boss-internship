import { combineReducers } from 'redux-immutable';
import securityRotaOverview from './security-rota-overview';
import securityRotaDay from './security-rota-day';
import securityShiftRequestsCount from './security-shift-requests-count';

export default combineReducers({
  securityRotaOverview,
  securityRotaDay,
  securityShiftRequestsCount,
});
