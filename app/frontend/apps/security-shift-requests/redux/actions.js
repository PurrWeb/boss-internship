import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import * as types from './types';
import {
  addSecurityShiftRequestRequest,
  updateSecurityShiftRequestRequest,
  deleteSecurityShiftRequestRequest,
} from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const addSecurityShiftRequestAction = createAction(types.ADD_SECURITY_SHIFT_REQUEST);
export const updateSecurityShiftRequestAction = createAction(types.UPDATE_SECURITY_SHIFT_REQUEST);
export const removeSecurityShiftRequestAction = createAction(types.REMOVE_SECURITY_SHIFT_REQUEST);

export const addSecurityShiftRequest = params => (dispatch, getState) => {
  const pageOptions = getState()
    .get('pageOptions')
    .toJS();
  const weekStartDate = oFetch(pageOptions, 'startDate');
  const weekEndDate = oFetch(pageOptions, 'endDate');
  const startsAt = oFetch(params, 'startsAt').toISOString();
  const endsAt = oFetch(params, 'endsAt').toISOString();
  const venueId = getState().getIn(['pageOptions', 'venueId']);
  const note = oFetch(params, 'note');
  return addSecurityShiftRequestRequest({
    startsAt,
    endsAt,
    note,
    venueId,
  }).then(resp => {
    const securityShiftRequest = oFetch(resp, 'data.securityShiftRequest');
    if (utils.shiftInRotaWeek(weekStartDate, weekEndDate, securityShiftRequest)) {
      dispatch(addSecurityShiftRequestAction(resp.data));
    }
  });
};

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
      dispatch(removeSecurityShiftRequestAction(response.data))
    }
    return response;
  });
};

export const deleteSecurityShiftRequest = id => (dispatch, getState) => {
  return deleteSecurityShiftRequestRequest({ id }).then(response => {
    dispatch(updateSecurityShiftRequestAction(response.data));
    return response;
  });
};
