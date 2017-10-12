import axios from 'axios';

import {
  CHANGE_VENUE,
  FILL_VOUCHERS_DATA
} from '../constants/action-names';

import {search} from './filter-actions';

export const changeVenue = (venue) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_VENUE,
    payload: venue,
  });

  dispatch(search());
}

export const fillVouchers = (data) => {
  return {
    type: FILL_VOUCHERS_DATA,
    payload: data,
  }
}

