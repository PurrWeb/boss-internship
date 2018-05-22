import { combineReducers } from 'redux-immutable';
import page from './page-options';
import staffTypes from './staff-types';
import staffMembers from './staff-members';
import financeReports from './finance-reports';

export default combineReducers({
  page,
  staffTypes,
  staffMembers,
  financeReports,
});
