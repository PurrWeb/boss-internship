import { combineReducers } from 'redux-immutable';
import { reducer as formReducer } from 'redux-form/immutable';
import diaries from './diaries-reducer';
import venues from './venues-reducer';
import users from './users-reducer';
import page from './page-reducer';

export default combineReducers({
  diaries,
  venues,
  users,
  page,
  form: formReducer,
});
