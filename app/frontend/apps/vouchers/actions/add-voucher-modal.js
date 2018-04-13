import {
  OPEN_ADD_VOUCHER_MODAL,
  CLOSE_ADD_VOUCHER_MODAL,
  CREATE_VOUCHER,
  ADD_VOUCHER_SUCCESS,
  DELETE_VOUCHER,
} from '../constants/action-names';

import axios from 'axios';

export const openVoucherModal = (submission) => {
  return {
    type: OPEN_ADD_VOUCHER_MODAL,
  };
}

export const closeVoucherModal = () => {
  return {
    type: CLOSE_ADD_VOUCHER_MODAL,
  };
}

export const createVoucher = (description) => (dispatch, getState) => {

  const currentVenueId = getState().getIn(['currentVenue', 'id']);
  const accessToken = getState().get('accessToken');

  axios.post('/api/v1/vouchers', {
    description: description,
    venue_id: currentVenueId,
  },
  {
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: ADD_VOUCHER_SUCCESS,
      payload: resp.data
    });
    dispatch({
      type: CLOSE_ADD_VOUCHER_MODAL
    })
  });
}

export const deleteVoucher = (voucher_id) => (dispatch, getState) => {

  const currentVenue = getState().get('currentVenue');
  const accessToken = getState().get('accessToken');

  axios.delete(`/api/v1/vouchers/${voucher_id}`,
  {
    params: {
      venue_id: currentVenue.get('id'),
    },
    headers: {
      Authorization: `Token token="${accessToken}"`
    }
  }).then((resp) => {
    dispatch({
      type: DELETE_VOUCHER,
      payload: resp.data,
    });
  })

}
