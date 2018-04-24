import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';
import { addSecurityShiftRequestRequest } from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const addSecurityShiftRequestAction = createAction(types.ADD_SECURITY_SHIFT_REQUEST);

export const addSecurityShiftRequest = params => (dispatch, getState) => {
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
    dispatch(
      addSecurityShiftRequestAction(resp.data),
    );
  })
};
