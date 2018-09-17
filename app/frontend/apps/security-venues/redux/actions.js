import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';

import { addVenueRequest, updateSecurityVenueRequest } from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const addVenueAction = createAction(types.ADD_VENUE);
export const editVenueAction = createAction(types.EDIT_VENUE);

export const addSecurityVenue = values => (dispatch, getState) => {
  return addVenueRequest(values).then(response => {
    dispatch(addVenueAction(response.data));
  });
};

export const editSecurityVenue = values => (dispatch, getState) => {
  return updateSecurityVenueRequest(values).then(response => {
    dispatch(editVenueAction(response.data));
  });
};
