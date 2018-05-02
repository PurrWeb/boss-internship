import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import * as types from './types';

import { addVenueRequest, updateVenueRequest } from '../requests';

export const loadInitialData = createAction(types.INITIAL_LOAD);
export const addVenueAction = createAction(types.ADD_VENUE);
export const editVenueAction = createAction(types.EDIT_VENUE);

export const addVenue = params => (dispatch, getState) => {
  const { name, address } = params;
  // addVenueRequest
  return new Promise((res, rej) => {
    setTimeout(
      () =>
        res({
          data: {
            // errors: {
            //   name: 'This is a required field!',
            //   address: 'This is a required field!',
            //   base: 'There was a problem creating this venue. Please check for errors and try again',
            // },
            id: 234223,
          },
        }),
      1000,
    );
  }).then(response => {
    dispatch(addVenueAction({ name, address, id: response.data.id }));
  });
};

export const editVenue = params => (dispatch, getState) => {
  // updateVenueRequest
  return new Promise((res, rej) => {
    setTimeout(
      () =>
        res({
          response: {
            data: {
              // errors: {
              //   name: 'This is a required field!',
              //   address: 'This is a required field!',
              //   base: 'There was a problem creating this venue. Please check for errors and try again',
              // },
            },
          },
        }),
      1000,
    );
  }).then(response => dispatch(editVenueAction(params)));
};
