import { createAction } from 'redux-actions';
import moment from 'moment';
import notify from '~/components/global-notification';
import { submit } from 'redux-form/immutable';
import oFetch from 'o-fetch';
import { BOSS_VENUE_TYPE, SECURITY_VENUE_TYPE } from '~/lib/utils';

import {
  INITIAL_LOAD,
  ADD_NEW_SHIFT,
  CANCEL_ADD_NEW_SHIFT,
  SHOW_GRAPH_DETAILS,
  CLOSE_GRAPH_DETAILS,
  UPDATE_ROTA_SHIFT,
  DELETE_ROTA_SHIFT,
  ADD_ROTA_SHIFT,
  OPEN_MULTIPLE_SHIFT,
  CLOSE_MULTIPLE_SHIFT,
  SET_MULTIPLE_SHIFT_STAFF_ID,
  SET_VENUES_FILTER,
  SET_ROTA_STATUS,
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
  ADD_SECURITY_VENUE_SHIFT,
  DELETE_SECURITY_VENUE_SHIFT,
} from './constants';

import {
  updateStaffMemberShiftRequest,
  deleteStaffMemberShiftRequest,
  addShiftRequest,
  addSecurityVenueShiftRequest,
  disableSecurityVenueShiftRequest,
  updateSecurityVenueShiftRequest,
} from './requests';

export const addNewShift = createAction(ADD_NEW_SHIFT);
export const cancelAddNewShift = createAction(CANCEL_ADD_NEW_SHIFT);
export const showGraphDetails = createAction(SHOW_GRAPH_DETAILS);
export const closeGraphDetails = createAction(CLOSE_GRAPH_DETAILS);
export const updateRotaShift = createAction(UPDATE_ROTA_SHIFT);
export const addRotaShift = createAction(ADD_ROTA_SHIFT);
export const addSecurityVenueShift = createAction(ADD_SECURITY_VENUE_SHIFT);
export const deleteRotaShift = createAction(DELETE_ROTA_SHIFT);
export const deleteSecurityVenueShift = createAction(DELETE_SECURITY_VENUE_SHIFT);
export const openMultipleShift = createAction(OPEN_MULTIPLE_SHIFT);
export const closeMultipleShift = createAction(CLOSE_MULTIPLE_SHIFT);
export const setMultipleShiftStaffId = createAction(SET_MULTIPLE_SHIFT_STAFF_ID);
export const setVenuesFilter = createAction(SET_VENUES_FILTER);
export const updateStaffMemberShiftInfo = createAction(UPDATE_STAFF_MEMBER_SHIFT_INFO);

export const initialLoad = createAction(INITIAL_LOAD);

export const updateStaffMemberShift = values => (dispatch, getState) => {
  const { venueId, venueType } = values;
  if (venueType === BOSS_VENUE_TYPE) {
    return updateStaffMemberShiftRequest(values).then(resp => {
      dispatch(updateRotaShift({ ...resp.data.rotaShift, venueId }));
      dispatch(updateStaffMemberShiftInfo(resp.data.rotaShift.staffMemberId));
      dispatch(closeGraphDetails());
    });
  } else if (venueType === SECURITY_VENUE_TYPE) {
    return updateSecurityVenueShiftRequest(values).then(resp => {
      dispatch(updateRotaShift({ ...resp.data, venueId }));
      dispatch(updateStaffMemberShiftInfo(resp.data.staffMemberId));
      dispatch(closeGraphDetails());
    });
  } else {
    throw new Error('Unknow venue type');
  }
};

export const deleteStaffMemberShift = (shiftId, staffMemberId, venueType) => (dispatch, getState) => {
  if (venueType === BOSS_VENUE_TYPE) {
    return deleteStaffMemberShiftRequest(shiftId).then(resp => {
      dispatch(deleteRotaShift({ shiftId, venueType }));
      dispatch(updateStaffMemberShiftInfo(staffMemberId));
      dispatch(closeGraphDetails());
    });
  } else if (venueType === SECURITY_VENUE_TYPE) {
    return disableSecurityVenueShiftRequest(shiftId).then(resp => {
      dispatch(deleteRotaShift({ shiftId, venueType }));
      dispatch(updateStaffMemberShiftInfo(staffMemberId));
      dispatch(closeGraphDetails());
    });
  } else {
    throw new Error('Unknow venue type');
  }
};

export const addShift = values => (dispatch, getState) => {
  const rotaDate = getState().getIn(['page', 'date']);

  const isMultipleShift = getState().getIn(['page', 'isMultipleShift']);
  if (isMultipleShift) {
    const staffMemberId = getState().getIn(['page', 'multipleShiftStaffId']);
    values = { ...values, staffMemberId };
  }

  const venueCombinedId = oFetch(values, 'venueId');
  const [type, stringVenueId] = venueCombinedId.split('_');
  const venueId = Number(stringVenueId);
  if (type === BOSS_VENUE_TYPE) {
    return addShiftRequest({ ...values, venueId }, rotaDate).then(resp => {
      dispatch(addRotaShift({ ...resp.data, venueId }));
      dispatch(updateStaffMemberShiftInfo(values.staffMemberId));
      return resp;
    });
  } else if (type === SECURITY_VENUE_TYPE) {
    return addSecurityVenueShiftRequest({ ...values, venueId }, rotaDate).then(resp => {
      dispatch(addSecurityVenueShift({ ...resp.data, venueId }));
      dispatch(updateStaffMemberShiftInfo(values.staffMemberId));
      return resp;
    });
  } else {
    throw new Error('Unknow venue type');
  }
};

export const submitMultipleStaffShift = staffMemberId => (dispatch, getState) => {
  dispatch(setMultipleShiftStaffId(staffMemberId));
  dispatch(submit('add-multiple-shift-form'));
};
