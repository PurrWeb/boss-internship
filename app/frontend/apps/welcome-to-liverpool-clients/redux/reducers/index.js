import { combineReducers } from 'redux-immutable';
import clients from './clients';
import filter from './filter';
import universities from './universities';
import pagination from './pagination';
import profile from './profile';
import { reducer as formReducer } from 'redux-form/immutable';

export default combineReducers({
  clients,
  filter,
  form: formReducer,
  universities,
  pagination,
  profile,
});
