import { createAction } from 'redux-actions';
import * as types from './types';

import oFetch from 'o-fetch';

import { markReportCompletedRequest, markReportsCompletedRequest } from '../requests';

export const loadInitialData = createAction(types.LOAD_INITIAL_DATA);
export const setReportStatusDone = createAction(types.SET_REPORT_STATUS_DONE);
export const changePayRateFilter = createAction(types.CHANGE_PAY_RATE_FILTER);
export const markReportCompletedAction = createAction(types.MARK_REPORT_COMPLETED);
export const markReportsCompletedAction = createAction(types.MARK_REPORTS_COMPLETED);

export const markReportCompleted = options => (dispatch, getState) => {
  const date = getState().getIn(['page', 'date']);
  const staffMemberId = oFetch(options, 'staffMemberId');
  const reportsId = oFetch(options, 'reportsId');

  return markReportCompletedRequest({ date, staffMemberId }).then(response => {
    dispatch(markReportCompletedAction({ reportsId }));
  });
};

export const markReportsCompleted = options => (dispatch, getState) => {
  const date = getState().getIn(['page', 'date']);
  const staffMemberIds = oFetch(options, 'staffMemberIds');
  const reportsIds = oFetch(options, 'reportsIds');

  return markReportsCompletedRequest({ date, staffMemberIds }).then(response => {
    dispatch(markReportsCompletedAction({ reportsIds }));
  });
};
