import { createAction } from 'redux-actions';
import oFetch from 'o-fetch';
import utils from "~/lib/utils";
import * as constants from './constants';
import { indexRequest } from './requests';

export const initialPageLoad = (params) => (dispatch, getState) => {
  const staffMember = oFetch(params, 'staffMember');
  const accessToken = oFetch(params, 'accessToken');
  const payments = oFetch(params, 'payments');
  const paymentFilter = oFetch(params, 'paymentFilter');

  dispatch(loadInitialState({
    staffMember: staffMember,
    accessToken: accessToken,
    payments: payments,
    paymentFilter: paymentFilter
  }));
}

export const filterPayments = (params) => (dispatch, getState) => {
  const accessToken = oFetch(params, 'accessToken');
  const staffMemberId = oFetch(params, 'staffMemberId');
  const filterParams = oFetch(params, 'filterParams');

  return indexRequest({
    accessToken: accessToken,
    staffMemberId: staffMemberId,
    mStartDate: oFetch(filterParams, 'mStartDate'),
    mEndDate: oFetch(filterParams, 'mEndDate'),
    statusFilter: oFetch(filterParams, 'statusFilter')
  }).then((response) => {
    dispatch(refreshPayments(response.data));
  });
}

export const loadInitialState = createAction(constants.INITIAL_PAGE_LOAD);
export const refreshPayments = createAction(constants.REFRESH_PAYMENTS);
