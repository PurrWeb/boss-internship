import { combineReducers } from 'redux-immutable';
import securityRotaOverview from './security-rota-overview';
import securityRotaDay from './security-rota-day';

export default combineReducers({
  securityRotaOverview,
  securityRotaDay,
});
