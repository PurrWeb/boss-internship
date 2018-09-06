import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

import { markReportCompletedRequest, markReportsCompletedRequest } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const setReportStatusDone = createAction(types.SET_REPORT_STATUS_DONE);
export const changePayRateFilter = createAction(types.CHANGE_PAY_RATE_FILTER);
export const markReportsCompletedAction = createAction(types.MARK_REPORTS_COMPLETED);

export const markReportCompleted = options => (dispatch, getState) => {
  const pageStateJS = getState().get('page').toJS()
  const date = oFetch(pageStateJS, 'date');
  const venueId = oFetch(pageStateJS, 'venueId');
  const staffMemberId = oFetch(options, 'staffMemberId');

  return markReportCompletedRequest({ date, staffMemberId, venueId }).then(response => {
    dispatch(markReportsCompletedAction(response.data));
  });
};

export const markReportsCompleted = options => (dispatch, getState) => {
  const pageStateJS = getState().get('page').toJS()
  const date = oFetch(pageStateJS, 'date');
  const venueId = oFetch(pageStateJS, 'venueId');
  const staffMemberIds = oFetch(options, 'staffMemberIds');

  return markReportsCompletedRequest({ date, staffMemberIds, venueId }).then(response => {
    dispatch(markReportsCompletedAction(response.data));
  });
};
