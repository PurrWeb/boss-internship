
import { createAction } from 'redux-actions';
import moment from 'moment';
import notify from '~/components/global-notification';
import { submit } from 'redux-form/immutable';

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
  SET_STAFF_TYPES_FILTER,
  SET_ROTA_STATUS,
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
} from './constants';

import {
  updateStaffMemberShiftRequest,
  deleteStaffMemberShiftRequest,
  addShiftRequest,
  setRotaStatusRequest,
} from './requests';

export const addNewShift = createAction(ADD_NEW_SHIFT);
export const cancelAddNewShift = createAction(CANCEL_ADD_NEW_SHIFT);
export const showGraphDetails = createAction(SHOW_GRAPH_DETAILS);
export const closeGraphDetails = createAction(CLOSE_GRAPH_DETAILS);
export const updateRotaShift = createAction(UPDATE_ROTA_SHIFT);
export const addRotaShift = createAction(ADD_ROTA_SHIFT);
export const deleteRotaShift = createAction(DELETE_ROTA_SHIFT);
export const openMultipleShift = createAction(OPEN_MULTIPLE_SHIFT);
export const closeMultipleShift = createAction(CLOSE_MULTIPLE_SHIFT);
export const setMultipleShiftStaffId = createAction(SET_MULTIPLE_SHIFT_STAFF_ID);
export const setStaffTypesFilter = createAction(SET_STAFF_TYPES_FILTER);
export const updateStaffMemberShiftInfo = createAction(UPDATE_STAFF_MEMBER_SHIFT_INFO);

export const initialLoad = createAction(INITIAL_LOAD);

export const updateStaffMemberShift = (values) => (dispatch, getState) => {
  return updateStaffMemberShiftRequest(values).then(resp => {
    notify('Rota Shift Updated Successfully', {
      interval: 5000,
      status: 'success'
    });
    dispatch(updateRotaShift(resp.data));
    dispatch(updateStaffMemberShiftInfo(resp.data.staff_member.id));
    dispatch(closeGraphDetails());
  })
}

export const deleteStaffMemberShift = (shift_id, staffMemberId) => (dispatch, getState) => {
  return deleteStaffMemberShiftRequest(shift_id).then(resp => {
    notify('Rota Shift Deleted Successfully', {
      interval: 5000,
      status: 'success'
    });
    dispatch(deleteRotaShift(shift_id));
    dispatch(updateStaffMemberShiftInfo(staffMemberId));
    dispatch(closeGraphDetails());
  })
}

export const addShift = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenue', 'id']);
  const rotaDate = getState().getIn(['page', 'rota', 'date']);

  const isMultipleShift = getState().getIn(['page', 'isMultipleShift']);

  if (isMultipleShift) {
    const staffMemberId = getState().getIn(['page', 'multipleShiftStaffId']);
    values = {...values, staff_member_id: staffMemberId};
  }

  return addShiftRequest(values, venueId, rotaDate).then(resp => {
    notify('Rota Shift Added Successfully', {
      interval: 5000,
      status: 'success'
    });
    dispatch(addRotaShift(resp.data));
    dispatch(updateStaffMemberShiftInfo(values.staff_member_id));
    return resp;
  })
}

export const submitMultipleStaffShift = (staffMemberId) => (dispatch, getState) => {
  dispatch(setMultipleShiftStaffId(staffMemberId));
  dispatch(submit('add-multiple-shift-form'));
}

export const setRotaStatus = (status) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenue', 'id']);
  const rotaDate = getState().getIn(['page', 'rota', 'date']);

  return setRotaStatusRequest(status, venueId, rotaDate).then(resp => {
    console.log(resp.data);
  });
};
