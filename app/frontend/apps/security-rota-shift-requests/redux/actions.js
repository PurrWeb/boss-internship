import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const changeWeekDay = createAction(types.CHANGE_WEEK_DAY);
export const selectVenue = createAction(types.SELECT_VENUE);

export const rejectSecurityShiftRequestAction = createAction(
  types.REJECT_SECURITY_SHIFT_REQUEST,
);

export const rejectSecurityShiftRequest = params => (dispatch, getState) => {
  const note = oFetch(params, 'note');
  const venueId = oFetch(params, 'venueId');
  const id = oFetch(params, 'id');

  dispatch(rejectSecurityShiftRequestAction({ id }));
};
