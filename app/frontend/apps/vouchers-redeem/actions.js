import { createAction } from 'redux-actions';
import moment from 'moment';
import notify from '~/components/global-notification';

import {
  INITIAL,
} from './constants';

import {
  redeemVoucherRequest
} from './requests';

export const initialLoad = createAction(INITIAL);

export const redeemVoucher = (values) => (dispatch, getState) => {
  return redeemVoucherRequest(values)
    .then(() => {
      notify('Voucher Redeem Successfully', {
        interval: 5000,
        status: 'success'
      });
    })
}
