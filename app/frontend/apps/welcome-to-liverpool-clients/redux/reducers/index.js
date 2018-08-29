import { combineReducers } from 'redux-immutable';
import clients from './clients';
import filter from './filter';
import { reducer as formReducer } from 'redux-form/immutable';


export default combineReducers({
  clients,
  filter,
  form: formReducer,
});
