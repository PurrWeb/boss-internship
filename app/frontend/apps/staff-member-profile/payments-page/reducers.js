import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import safeMoment from "~/lib/safe-moment";
import oFetch from 'o-fetch';

import {
  INITIAL_PAGE_LOAD,
  REFRESH_PAYMENTS
} from './constants';

const initialGlobalState = fromJS({
  staffMember: null,
  accessToken: null,
  payments: [],
  paymentFilter: {
    sStateDate: null,
    sEndDate: null,
    statusFilter: null
  }
})

export const globalReducer = handleActions({
  [INITIAL_PAGE_LOAD]: (state, action) => {
    const payload = oFetch(action, 'payload');
    const accessToken = oFetch(payload, 'accessToken');
    const staffMember = oFetch(payload, 'staffMember');
    const payments = oFetch(payload, 'payments');
    const rawPaymentFilter = oFetch(payload, 'paymentFilter');
    const paymentFilter = {
      mStartDate: safeMoment.uiDateParse(oFetch(rawPaymentFilter, 'sStartDate')),
      mEndDate: safeMoment.uiDateParse(oFetch(rawPaymentFilter, 'sEndDate')),
      statusFilter: oFetch(rawPaymentFilter, 'statusFilter')
    };
    
    window.boss.accessToken = accessToken;

    return state.
      set('accessToken', accessToken).
      set('staffMember', staffMember).
      set('payments', payments).
      set('paymentFilter', paymentFilter);
  },
  [REFRESH_PAYMENTS]: (state, action) => {
    const payments = oFetch(action, 'payload');

    return state.
      set('payments', payments);
  }
}, initialGlobalState);
