import { combineReducers } from 'redux-immutable';
import filter from './filter';
import cards from './cards';
import clients from './clients';
import pagination from './pagination';
export default combineReducers({
  clients,
  cards,
  filter,
  pagination,
});
