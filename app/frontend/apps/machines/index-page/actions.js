import { createAction } from 'redux-actions';
import notify from '~/components/global-notification';

import {
  INITIAL_LOAD,
  EDIT_MACHINE_HIDE,
  RESTORE_MACHINE_HIDE,
  EDIT_MACHINE_SHOW,
  RESTORE_MACHINE_SHOW,
  ADD_MACHINE,
  ADD_NEW_MACHINE_HIDE,
  ADD_NEW_MACHINE_SHOW,
  UPDATE_MACHINE,
} from './constants';

import {
  createMachineRequest,
  updateMachineRequest,
  disableMachineRequest,
  restoreMachineRequest,
} from './requests';

export const initialLoad = createAction(INITIAL_LOAD);
export const showEditMachine = createAction(EDIT_MACHINE_SHOW);
export const hideEditMachine = createAction(EDIT_MACHINE_HIDE);
export const showRestoreMachine = createAction(RESTORE_MACHINE_SHOW);
export const hideRestoreMachine = createAction(RESTORE_MACHINE_HIDE);
export const addMachine = createAction(ADD_MACHINE);
export const hideAddNewMachine = createAction(ADD_NEW_MACHINE_HIDE);
export const showAddNewMachine = createAction(ADD_NEW_MACHINE_SHOW);
export const updateMachine = createAction(UPDATE_MACHINE);

export const createMachine = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);
  const formatedValues = {
    floatCents: values.floatCents ? values.floatCents * 100 : null,
    initialFloatTopupCents: values.initialFloatTopupCents * 100,
  };
  return createMachineRequest({formatedValues: {...values, ...formatedValues}, venueId})
    .then((resp) => {
      dispatch(addMachine(resp.data))
      dispatch(hideAddNewMachine());
      window.scrollTo(0, 0);
      notify('Machine Created Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}

export const editMachine = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  return updateMachineRequest({values, venueId})
    .then((resp) => {
      dispatch(updateMachine(resp.data))
      dispatch(hideEditMachine());
      window.scrollTo(0, 0);
      notify('Machine Updated Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}

export const disableMachine = (machineId) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  return disableMachineRequest({machineId, venueId})
    .then((resp) => {
      dispatch(updateMachine(resp.data))
      window.scrollTo(0, 0);
      notify('Machine Disabled Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}

export const restoreMachine = (values) => (dispatch, getState) => {
  const venueId = getState().getIn(['page', 'currentVenueId']);

  return restoreMachineRequest({values, venueId})
    .then((resp) => {
      dispatch(updateMachine(resp.data))
      dispatch(hideRestoreMachine());
      window.scrollTo(0, 0);
      notify('Machine Restored Successfully', {
        interval: 5000,
        status: 'success'
      });
    });
}
