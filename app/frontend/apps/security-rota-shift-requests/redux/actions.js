import { createAction } from 'redux-actions';
import * as types from './types';
import {
  assignShiftRequestRequest,
  rejectShiftRequestRequest,
} from '../requests';
import oFetch from 'o-fetch';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changeWeekDay = createAction(types.CHANGE_WEEK_DAY);
export const selectVenue = createAction(types.SELECT_VENUE);
export const setAssigningShiftRequest = createAction(
  types.SET_ASSIGNING_SHIFT_REQUEST,
);
export const removeRequestAction = createAction(
  types.REMOVE_SECURITY_SHIFT_REQUEST,
);
export const addRotaShift = createAction(types.ADD_ROTA_SHIFT);
export const addRota = createAction(types.ADD_ROTA);

export const rejectSecurityShiftRequest = params => (dispatch, getState) => {
  const rejectReason = oFetch(params, 'rejectReason');
  const venueId = oFetch(params, 'venueId');
  const id = oFetch(params, 'id');
  return rejectShiftRequestRequest({ id, rejectReason }).then(() =>
    dispatch(removeRequestAction({ id })),
  );
};

export const assignShiftRequest = params => (dispatch, getState) => {
  const id = oFetch(params, 'id');
  const staffMemberId = oFetch(params, 'staffMemberId');
  const startsAt = oFetch(params, 'startsAt');
  const endsAt = oFetch(params, 'endsAt');

  return assignShiftRequestRequest({ id, staffMemberId, startsAt, endsAt }).then(response => {
    const rotaShift = oFetch(response, 'data.rotaShift');
    const responseRota = oFetch(response, 'data.rota');

    dispatch(removeRequestAction({ id }));
    const isRotaExists = !!getState()
      .get('weekRotas')
      .find(rota => rota.get('id') === oFetch(responseRota, 'id'));
    if (!isRotaExists) {
      dispatch(addRota({ rota: responseRota }));
    }
    dispatch(addRotaShift({ rotaShift }));
  });
};
