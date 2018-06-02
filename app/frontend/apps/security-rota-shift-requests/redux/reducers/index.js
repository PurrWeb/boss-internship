import { combineReducers } from 'redux-immutable';
import venues from './venues';
import pageOptions from './page-options';
import staffMembers from './staff-members';
import staffTypes from './staff-types';
import weekRotaShifts from './week-rota-shifts';
import weekRotas from './week-rotas';
import weekShiftRequests from './week-shift-requests';
import assigningShiftRequest from './assigning-shift-request';
import permissions from './permissions-reducer';
import graphDetails from './graph-details-reducer';

export default combineReducers({
  staffMembers,
  venues,
  staffTypes,
  page: pageOptions,
  weekRotaShifts,
  weekRotas,
  weekShiftRequests,
  assigningShiftRequest,
  permissions,
  graphDetails,
});
