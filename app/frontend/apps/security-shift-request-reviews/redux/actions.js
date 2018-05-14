import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import * as types from './types';

import {
  addSecurityShiftRequestRequest,
  acceptSecurityShiftRequestRequest,
  rejectSecurityShiftRequestRequest,
  undoSecurityShiftRequestRequest,
  updateSecurityShiftRequestRequest,
} from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const updateSecurityShiftRequestAction = createAction(types.UPDATE_SECURITY_SHIFT_REQUEST);
export const removeSecurityShiftRequestAction = createAction(types.REMOVE_SECURITY_SHIFT_REQUEST);

export const editSecurityShiftRequest = values => (dispatch, getState) => {
  const pageOptions = getState()
    .get('pageOptions')
    .toJS();
  const weekStartDate = oFetch(pageOptions, 'startDate');
  const weekEndDate = oFetch(pageOptions, 'endDate');
  const startsAt = oFetch(values, 'startsAt').toISOString();
  const endsAt = oFetch(values, 'endsAt').toISOString();
  const venueId = oFetch(values, 'venueId');
  const id = oFetch(values, 'id');
  const note = oFetch(values, 'note');

  return updateSecurityShiftRequestRequest({
    startsAt,
    endsAt,
    venueId,
    id,
    note,
  }).then(response => {
    const securityShiftRequest = oFetch(response, 'data.securityShiftRequest');
    if (utils.shiftInRotaWeek(weekStartDate, weekEndDate, securityShiftRequest)) {
      dispatch(updateSecurityShiftRequestAction(response.data));
    } else {
      dispatch(removeSecurityShiftRequestAction(response.data));
    }
    return response;
  });
};

export const rejectSecurityShiftRequest = params => (dispatch, getState) => {
  const securityShiftRequestId = oFetch(params, 'id');
  const rejectReason = oFetch(params, 'rejectReason');

  return rejectSecurityShiftRequestRequest(securityShiftRequestId, rejectReason).then(response => {
    dispatch(updateSecurityShiftRequestAction(response.data));
    return response;
  });
};

export const undoSecurityShiftRequest = params => (dispatch, getState) => {
  const securityShiftRequestId = oFetch(params, 'id');
  return undoSecurityShiftRequestRequest(securityShiftRequestId).then(response => {
    dispatch(updateSecurityShiftRequestAction(response.data));
    return response;
  });
};

export const acceptSecurityShiftRequest = params => (dispatch, getState) => {
  const securityShiftRequestId = oFetch(params, 'id');
  return acceptSecurityShiftRequestRequest(securityShiftRequestId).then(response => {
    dispatch(updateSecurityShiftRequestAction(response.data));
    return response;
  });
};
