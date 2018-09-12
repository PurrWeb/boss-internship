import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import invites from './invites';
import filters from './filters';
import venues from './venues';

export default combineReducers({
  invites,
  filters,
  venues,
  form: formReducer,
});
