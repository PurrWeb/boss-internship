import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import uuid from 'uuid/v1';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const financeReports = oFetch(action, 'payload.financeReports');
      return Immutable.fromJS(financeReports).map(financeReport =>
        financeReport.set('frontendId', financeReport.get('id') === null ? uuid() : financeReport.get('id')),
      );
    },
    [types.MARK_REPORT_COMPLETED]: (state, action) => {
      const reportsId = oFetch(action, 'payload.reportsId');
      const reportIndex = state.findIndex(report => report.get('frontendId') === reportsId);
      return state.setIn([reportIndex, 'status'], 'done');
    },
    [types.MARK_REPORTS_COMPLETED]: (state, action) => {
      const reportsIds = oFetch(action, 'payload.reportsIds');

      return state.map(financeReport => {
        if (!reportsIds.includes(financeReport.get('frontendId'))) {
          return financeReport;
        }
        return financeReport.setIn(['status'], 'done');
      })

    },
  },
  initialState,
);
