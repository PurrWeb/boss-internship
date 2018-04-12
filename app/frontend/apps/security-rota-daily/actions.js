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
  SET_VENUES_FILTER,
  SET_ROTA_STATUS,
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
} from './constants';

import {
  updateStaffMemberShiftRequest,
  deleteStaffMemberShiftRequest,
  addShiftRequest,
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
export const setMultipleShiftStaffId = createAction(
  SET_MULTIPLE_SHIFT_STAFF_ID,
);
export const setVenuesFilter = createAction(SET_VENUES_FILTER);
export const updateStaffMemberShiftInfo = createAction(
  UPDATE_STAFF_MEMBER_SHIFT_INFO,
);

export const initialLoad = createAction(INITIAL_LOAD);

export const updateStaffMemberShift = values => (dispatch, getState) => {
  const { venueId } = values;
  return updateStaffMemberShiftRequest(values).then(resp => {
    dispatch(updateRotaShift({...resp.data.rotaShift, venueId}));
    dispatch(updateStaffMemberShiftInfo(resp.data.rotaShift.staffMemberId));
    dispatch(closeGraphDetails());
  });
};

export const deleteStaffMemberShift = (shiftId, staffMemberId) => (
  dispatch,
  getState,
) => {
  return deleteStaffMemberShiftRequest(shiftId).then(resp => {
    dispatch(deleteRotaShift(shiftId));
    dispatch(updateStaffMemberShiftInfo(staffMemberId));
    dispatch(closeGraphDetails());
  });
};

export const addShift = values => (dispatch, getState) => {
  const rotaDate = getState().getIn(['page', 'date']);

  const isMultipleShift = getState().getIn(['page', 'isMultipleShift']);
  if (isMultipleShift) {
    const staffMemberId = getState().getIn(['page', 'multipleShiftStaffId']);
    values = { ...values, staffMemberId };
  }

  return addShiftRequest(values, rotaDate).then(resp => {
    const { venueId } = values;
    dispatch(addRotaShift({...resp.data.rotaShift, venueId}));
    dispatch(updateStaffMemberShiftInfo(values.staffMemberId));
    return resp;
  });
};

export const submitMultipleStaffShift = staffMemberId => (
  dispatch,
  getState,
) => {
  dispatch(setMultipleShiftStaffId(staffMemberId));
  dispatch(submit('add-multiple-shift-form'));
};
