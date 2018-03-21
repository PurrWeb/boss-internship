import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

import {
  unacceptPeriodRequest,
  deletePeriodRequest,
  acceptPeriodRequest,
  clockOutRequest,
} from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const updatePeriodData = createAction(types.UPDATE_PERIOD_DATA);
export const updatePeriodStatus = createAction(types.UPDATE_PERIOD_STATUS);
export const removeHoursAcceptancePeriodAction = createAction(
  types.REMOVE_HOURS_ACCEPTANCE_PERIOD,
);
export const updateDynamicPeriodAction = createAction(
  types.UPDATE_DYNAMIC_PERIOD,
);
export const addNewAcceptancePeriodAction = createAction(
  types.ADD_NEW_ACCEPTANCE_PERIOD,
);

export const addNewAcceptancePeriodBreakAction = createAction(
  types.ADD_NEW_ACCEPTANCE_PERIOD_BREAK,
);

export const forceClockOutAction = createAction(types.FORCE_CLOCK_OUT);

export const unacceptPeriodAction = period => (dispatch, getState) => {
  return unacceptPeriodRequest(period).then(response => {
    const frontendId = oFetch(period, 'frontendId');
    dispatch(updatePeriodStatus({ ...response.data, frontendId }));
  });
};

export const acceptPeriodAction = period => (dispatch, getState) => {
  const venue = getState()
    .get('venue')
    .toJS();
  const venueId = oFetch(venue, 'id');

  return acceptPeriodRequest(period, venueId).then(response => {
    const frontendId = oFetch(period, 'frontendId');
    dispatch(updatePeriodStatus({ ...response.data, frontendId }));
  });
};

export const deletePeriodAction = values => (dispatch, getState) => {
  const periodId = oFetch(values, 'id');
  const frontendId = oFetch(values, 'frontendId');
  if (periodId === null) {
    dispatch(removeHoursAcceptancePeriodAction({ frontendId }));
  } else {
    return deletePeriodRequest(periodId).then(resp => {
      dispatch(removeHoursAcceptancePeriodAction({ frontendId }));
    });
  }
};

export const clockOutAction = ({ staffMemberId, date }) => (
  dispatch,
  getState,
) => {
  const venue = getState()
    .get('venue')
    .toJS();
  const venueId = oFetch(venue, 'id');
  return clockOutRequest({ staffMemberId, date, venueId }).then(response => {
    dispatch(forceClockOutAction(response.data));
  });
};
