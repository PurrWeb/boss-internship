import { createAction } from 'redux-actions';
import * as types from './types';
import { inviteUserRequest, revokeInviteRequest } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const setInitialFilters = createAction(types.SET_INITIAL_FILTERS);

export const changeRoleFilter = createAction(types.CHANGE_ROLE_FILTER);
export const changeStatusFilter = createAction(types.CHANGE_STATUS_FILTER);
export const updateInvite = createAction(types.UPDATE_INVITE);

export const inviteUserRequested = params => dispatch => {
  return inviteUserRequest(params).then(response => dispatch(updateInvite(response.data)));
};

export const revokeInviteRequested = params => dispatch => {
  return revokeInviteRequest(params).then(response => dispatch(updateInvite(response.data)));
};
